import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import BookingCard from '../components/BookingCard';
import { bookingAPI } from '../services/api';
import './CustomerBooking.css';

const CustomerBooking = () => {
  const { bookings, fetchBookings, createBooking, loading, error, setError } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    service_type: 'plumbing',
    address: '',
    scheduled_date: '',
    notes: ''
  });

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBooking(formData);
      setFormData({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        service_type: 'plumbing',
        address: '',
        scheduled_date: '',
        notes: ''
      });
      setShowForm(false);
      alert('Booking created successfully! A provider will be assigned shortly.');
    } catch (err) {
      alert('Failed to create booking: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleSelectBooking = async (booking) => {
    setSelectedBooking(booking);
    try {
      const response = await bookingAPI.getBookingHistory(booking.id);
      setBookingHistory(response.data.history);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingAPI.cancelBooking(bookingId, {
          cancelled_by: 'customer',
          reason: 'Cancelled by customer'
        });
        fetchBookings();
        setSelectedBooking(null);
        alert('Booking cancelled successfully');
      } catch (err) {
        alert('Failed to cancel booking: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="customer-booking-page">
      <div className="page-header">
        <h1>My Bookings</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Booking'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {showForm && (
        <div className="booking-form-container">
          <h2>Create New Booking</h2>
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-row">
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Service Type *</label>
                <select
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="painting">Painting</option>
                  <option value="hvac">HVAC</option>
                  <option value="carpentry">Carpentry</option>
                  <option value="gardening">Gardening</option>
                </select>
              </div>

              <div className="form-group">
                <label>Scheduled Date & Time *</label>
                <input
                  type="datetime-local"
                  name="scheduled_date"
                  value={formData.scheduled_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Service Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="2"
                required
              />
            </div>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
              />
            </div>

            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Creating...' : 'Create Booking'}
            </button>
          </form>
        </div>
      )}

      <div className="bookings-container">
        {loading && bookings.length === 0 ? (
          <div className="loading">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <p>No bookings yet. Create your first booking!</p>
          </div>
        ) : (
          <div className="bookings-grid">
            <div className="bookings-list">
              <h2>All Bookings ({bookings.length})</h2>
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onSelect={handleSelectBooking}
                />
              ))}
            </div>

            {selectedBooking && (
              <div className="booking-details">
                <div className="details-header">
                  <h2>Booking Details</h2>
                  <button onClick={() => setSelectedBooking(null)}>×</button>
                </div>

                <div className="details-content">
                  <div className="detail-item">
                    <strong>Booking ID:</strong> #{selectedBooking.id}
                  </div>
                  <div className="detail-item">
                    <strong>Customer:</strong> {selectedBooking.customer_name}
                  </div>
                  <div className="detail-item">
                    <strong>Phone:</strong> {selectedBooking.customer_phone}
                  </div>
                  <div className="detail-item">
                    <strong>Service:</strong> {selectedBooking.service_type}
                  </div>
                  <div className="detail-item">
                    <strong>Address:</strong> {selectedBooking.address}
                  </div>
                  <div className="detail-item">
                    <strong>Scheduled:</strong> {formatDate(selectedBooking.scheduled_date)}
                  </div>
                  {selectedBooking.provider_name && (
                    <div className="detail-item">
                      <strong>Provider:</strong> {selectedBooking.provider_name}
                    </div>
                  )}
                  {selectedBooking.notes && (
                    <div className="detail-item">
                      <strong>Notes:</strong> {selectedBooking.notes}
                    </div>
                  )}
                </div>

                {selectedBooking.status !== 'completed' && selectedBooking.status !== 'cancelled' && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancelBooking(selectedBooking.id)}
                  >
                    Cancel Booking
                  </button>
                )}

                <div className="booking-history">
                  <h3>Booking History</h3>
                  {bookingHistory.length === 0 ? (
                    <p>No history available</p>
                  ) : (
                    <div className="history-timeline">
                      {bookingHistory.map((entry) => (
                        <div key={entry.id} className="history-entry">
                          <div className="history-time">{formatDate(entry.timestamp)}</div>
                          <div className="history-content">
                            <strong>{entry.old_status ? `${entry.old_status} → ` : ''}{entry.new_status}</strong>
                            <div className="history-meta">
                              By: {entry.changed_by} ({entry.changed_by_role})
                            </div>
                            {entry.reason && <div className="history-reason">{entry.reason}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerBooking;
