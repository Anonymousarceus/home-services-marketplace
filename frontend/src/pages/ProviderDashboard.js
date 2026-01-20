import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import BookingCard from '../components/BookingCard';
import StatusBadge from '../components/StatusBadge';
import { bookingAPI } from '../services/api';
import './ProviderDashboard.css';

const ProviderDashboard = () => {
  const { bookings, fetchBookings, providers, fetchProviders, loading } = useApp();
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchBookings();
    fetchProviders();
  }, [fetchBookings, fetchProviders]);

  useEffect(() => {
    if (providers.length > 0 && !selectedProvider) {
      setSelectedProvider(providers[0].id);
    }
  }, [providers, selectedProvider]);

  const providerBookings = bookings.filter(
    (b) => b.provider_id === selectedProvider && b.status !== 'cancelled'
  );

  const handleAcceptBooking = async (bookingId) => {
    try {
      await bookingAPI.acceptBooking(bookingId, selectedProvider);
      fetchBookings();
      setSelectedBooking(null);
      alert('Booking accepted successfully!');
    } catch (err) {
      alert('Failed to accept booking: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleRejectBooking = async (bookingId) => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      await bookingAPI.rejectBooking(bookingId, selectedProvider, rejectReason);
      fetchBookings();
      setSelectedBooking(null);
      setRejectReason('');
      alert('Booking rejected. System will reassign to another provider.');
    } catch (err) {
      alert('Failed to reject booking: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleStartService = async (bookingId) => {
    try {
      await bookingAPI.startService(bookingId, selectedProvider);
      fetchBookings();
      setSelectedBooking(null);
      alert('Service started successfully!');
    } catch (err) {
      alert('Failed to start service: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCompleteService = async (bookingId) => {
    try {
      await bookingAPI.completeService(bookingId, selectedProvider, 'Service completed successfully');
      fetchBookings();
      setSelectedBooking(null);
      alert('Service completed successfully!');
    } catch (err) {
      alert('Failed to complete service: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleMarkNoShow = async (bookingId) => {
    if (window.confirm('Are you sure the customer did not show up?')) {
      try {
        await bookingAPI.markNoShow(bookingId, selectedProvider, 'Customer no-show');
        fetchBookings();
        setSelectedBooking(null);
        alert('Marked as no-show');
      } catch (err) {
        alert('Failed to mark no-show: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const getActionButtons = (booking) => {
    switch (booking.status) {
      case 'assigned':
        return (
          <div className="action-buttons">
            <button className="btn btn-success" onClick={() => handleAcceptBooking(booking.id)}>
              Accept Booking
            </button>
            <div className="reject-section">
              <input
                type="text"
                placeholder="Reason for rejection"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="reject-input"
              />
              <button className="btn btn-danger" onClick={() => handleRejectBooking(booking.id)}>
                Reject
              </button>
            </div>
          </div>
        );
      case 'accepted':
        return (
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={() => handleStartService(booking.id)}>
              Start Service
            </button>
            <button className="btn btn-warning" onClick={() => handleMarkNoShow(booking.id)}>
              Mark No-Show
            </button>
          </div>
        );
      case 'in_progress':
        return (
          <div className="action-buttons">
            <button className="btn btn-success" onClick={() => handleCompleteService(booking.id)}>
              Complete Service
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const currentProvider = providers.find((p) => p.id === selectedProvider);

  return (
    <div className="provider-dashboard">
      <div className="page-header">
        <h1>Provider Dashboard</h1>
      </div>

      {providers.length === 0 ? (
        <div className="loading">Loading providers...</div>
      ) : (
        <>
          <div className="provider-selector">
            <label>Select Provider:</label>
            <select
              value={selectedProvider || ''}
              onChange={(e) => setSelectedProvider(Number(e.target.value))}
              className="provider-select"
            >
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name} - {provider.service_types.join(', ')}
                </option>
              ))}
            </select>
          </div>

          {currentProvider && (
            <div className="provider-info">
              <h3>{currentProvider.name}</h3>
              <div className="provider-details">
                <span>Email: {currentProvider.email}</span>
                <span>Phone: {currentProvider.phone}</span>
                <span>Rating: ⭐ {currentProvider.rating}</span>
                <span>Services: {currentProvider.service_types.join(', ')}</span>
              </div>
            </div>
          )}

          <div className="bookings-stats">
            <div className="stat-card">
              <div className="stat-number">{providerBookings.length}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {providerBookings.filter((b) => b.status === 'assigned').length}
              </div>
              <div className="stat-label">Pending Acceptance</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {providerBookings.filter((b) => b.status === 'accepted').length}
              </div>
              <div className="stat-label">Accepted</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {providerBookings.filter((b) => b.status === 'in_progress').length}
              </div>
              <div className="stat-label">In Progress</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {providerBookings.filter((b) => b.status === 'completed').length}
              </div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

          <div className="bookings-container">
            {loading && providerBookings.length === 0 ? (
              <div className="loading">Loading bookings...</div>
            ) : providerBookings.length === 0 ? (
              <div className="empty-state">
                <p>No bookings assigned to this provider yet.</p>
              </div>
            ) : (
              <div className="bookings-grid">
                <div className="bookings-list">
                  <h2>Assigned Bookings</h2>
                  {providerBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onSelect={setSelectedBooking}
                    />
                  ))}
                </div>

                {selectedBooking && (
                  <div className="booking-details">
                    <div className="details-header">
                      <h2>Booking Actions</h2>
                      <button onClick={() => setSelectedBooking(null)}>×</button>
                    </div>

                    <div className="details-content">
                      <div className="detail-item">
                        <strong>Booking ID:</strong>
                        <span>#{selectedBooking.id}</span>
                      </div>
                      <div className="detail-item">
                        <strong>Status:</strong>
                        <StatusBadge status={selectedBooking.status} />
                      </div>
                      <div className="detail-item">
                        <strong>Customer:</strong>
                        <span>{selectedBooking.customer_name}</span>
                      </div>
                      <div className="detail-item">
                        <strong>Phone:</strong>
                        <span>{selectedBooking.customer_phone}</span>
                      </div>
                      <div className="detail-item">
                        <strong>Service:</strong>
                        <span>{selectedBooking.service_type}</span>
                      </div>
                      <div className="detail-item">
                        <strong>Scheduled:</strong>
                        <span>{formatDate(selectedBooking.scheduled_date)}</span>
                      </div>
                      <div className="detail-item">
                        <strong>Address:</strong>
                        <span>{selectedBooking.address}</span>
                      </div>
                      {selectedBooking.notes && (
                        <div className="detail-item">
                          <strong>Notes:</strong>
                          <span>{selectedBooking.notes}</span>
                        </div>
                      )}
                    </div>

                    {getActionButtons(selectedBooking)}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProviderDashboard;
