const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const { assignProviderWithRetry } = require('../services/assignmentService');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const bookingData = req.body;
    
    // Validate required fields
    if (!bookingData.customer_name || !bookingData.customer_phone || !bookingData.service_type || !bookingData.address || !bookingData.scheduled_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const bookingId = await Booking.create(bookingData);
    
    // Auto-assign provider in background (with retry logic)
    assignProviderWithRetry(bookingId, bookingData.service_type).catch(err => {
      console.error('Failed to auto-assign provider:', err);
    });

    const booking = await Booking.getById(bookingId);
    res.status(201).json({ 
      message: 'Booking created successfully',
      booking 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.getAll();
    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.getById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

// Get booking history
exports.getBookingHistory = async (req, res) => {
  try {
    const history = await Booking.getHistory(req.params.id);
    res.json({ history });
  } catch (error) {
    console.error('Error fetching booking history:', error);
    res.status(500).json({ error: 'Failed to fetch booking history' });
  }
};

// Cancel booking (customer or provider)
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancelled_by, reason } = req.body;

    const result = await Booking.updateStatus(
      id, 
      'cancelled', 
      cancelled_by || 'customer',
      req.body.role || 'customer',
      reason || 'Cancelled by user'
    );

    res.json({ 
      message: 'Booking cancelled successfully',
      ...result 
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(400).json({ error: error.message });
  }
};

// Manual provider assignment
exports.assignProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { provider_id } = req.body;

    if (!provider_id) {
      return res.status(400).json({ error: 'Provider ID is required' });
    }

    const result = await Booking.assignProvider(id, provider_id, 'admin', 'Manual assignment');
    
    res.json({ 
      message: 'Provider assigned successfully',
      ...result 
    });
  } catch (error) {
    console.error('Error assigning provider:', error);
    res.status(400).json({ error: error.message });
  }
};

// Provider accepts booking
exports.acceptBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { provider_id } = req.body;

    const result = await Booking.updateStatus(
      id, 
      'accepted', 
      `provider_${provider_id}`,
      'provider',
      'Provider accepted the booking'
    );

    res.json({ 
      message: 'Booking accepted successfully',
      ...result 
    });
  } catch (error) {
    console.error('Error accepting booking:', error);
    res.status(400).json({ error: error.message });
  }
};

// Provider rejects booking
exports.rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { provider_id, reason } = req.body;

    const result = await Booking.updateStatus(
      id, 
      'rejected', 
      `provider_${provider_id}`,
      'provider',
      reason || 'Provider rejected the booking'
    );

    // Trigger re-assignment
    const booking = await Booking.getById(id);
    assignProviderWithRetry(id, booking.service_type).catch(err => {
      console.error('Failed to reassign provider:', err);
    });

    res.json({ 
      message: 'Booking rejected, reassigning to another provider',
      ...result 
    });
  } catch (error) {
    console.error('Error rejecting booking:', error);
    res.status(400).json({ error: error.message });
  }
};

// Provider starts service
exports.startService = async (req, res) => {
  try {
    const { id } = req.params;
    const { provider_id } = req.body;

    const result = await Booking.updateStatus(
      id, 
      'in_progress', 
      `provider_${provider_id}`,
      'provider',
      'Service started'
    );

    res.json({ 
      message: 'Service started successfully',
      ...result 
    });
  } catch (error) {
    console.error('Error starting service:', error);
    res.status(400).json({ error: error.message });
  }
};

// Provider completes service
exports.completeService = async (req, res) => {
  try {
    const { id } = req.params;
    const { provider_id, notes } = req.body;

    const result = await Booking.updateStatus(
      id, 
      'completed', 
      `provider_${provider_id}`,
      'provider',
      notes || 'Service completed successfully'
    );

    res.json({ 
      message: 'Service completed successfully',
      ...result 
    });
  } catch (error) {
    console.error('Error completing service:', error);
    res.status(400).json({ error: error.message });
  }
};

// Provider marks no-show
exports.markNoShow = async (req, res) => {
  try {
    const { id } = req.params;
    const { provider_id, reason } = req.body;

    const result = await Booking.updateStatus(
      id, 
      'no_show', 
      `provider_${provider_id}`,
      'provider',
      reason || 'Customer no-show'
    );

    res.json({ 
      message: 'Marked as no-show',
      ...result 
    });
  } catch (error) {
    console.error('Error marking no-show:', error);
    res.status(400).json({ error: error.message });
  }
};

// Admin override (manual intervention)
exports.overrideStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { new_status, admin_name, reason } = req.body;

    if (!new_status) {
      return res.status(400).json({ error: 'New status is required' });
    }

    const result = await Booking.updateStatus(
      id, 
      new_status, 
      admin_name || 'admin',
      'admin',
      reason || 'Manual override by admin'
    );

    res.json({ 
      message: 'Status overridden successfully',
      ...result 
    });
  } catch (error) {
    console.error('Error overriding status:', error);
    res.status(400).json({ error: error.message });
  }
};
