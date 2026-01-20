import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import { bookingAPI } from '../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const { bookings, fetchBookings, providers, fetchProviders, loading } = useApp();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [overrideStatus, setOverrideStatus] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [assignProviderId, setAssignProviderId] = useState('');

  useEffect(() => {
    fetchBookings();
    fetchProviders();
  }, [fetchBookings, fetchProviders]);

  const handleSelectBooking = async (booking) => {
    setSelectedBooking(booking);
    setOverrideStatus(booking.status);
    setAssignProviderId(booking.provider_id || '');
    
    try {
      const response = await bookingAPI.getBookingHistory(booking.id);
      setBookingHistory(response.data.history);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const handleOverrideStatus = async () => {
    if (!overrideStatus || !overrideReason.trim()) {
      alert('Please select a status and provide a reason');
      return;
    }

    try {
      await bookingAPI.overrideStatus(
        selectedBooking.id,
        overrideStatus,
        'admin',
        overrideReason
      );
      fetchBookings();
      alert('Status overridden successfully');
      // Refresh history
      const response = await bookingAPI.getBookingHistory(selectedBooking.id);
      setBookingHistory(response.data.history);
      setOverrideReason('');
    } catch (err) {
      alert('Failed to override status: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleManualAssignment = async () => {
    if (!assignProviderId) {
      alert('Please select a provider');
      return;
    }

    try {
      await bookingAPI.assignProvider(selectedBooking.id, Number(assignProviderId));
      fetchBookings();
      alert('Provider assigned successfully');
    } catch (err) {
      alert('Failed to assign provider: ' + (err.response?.data?.error || err.message));
    }
  };

  const filteredBookings =
    filterStatus === 'all'
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusCounts = () => {
    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      assigned: bookings.filter((b) => b.status === 'assigned').length,
      accepted: bookings.filter((b) => b.status === 'accepted').length,
      in_progress: bookings.filter((b) => b.status === 'in_progress').length,
      completed: bookings.filter((b) => b.status === 'completed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
      rejected: bookings.filter((b) => b.status === 'rejected').length
    };
  };

  const stats = getStatusCounts();

  return (
    <div className="admin-panel">
      <div className="page-header">
        <h1>Admin / Ops Panel</h1>
        <div className="header-info">
          <span>Total Providers: {providers.length}</span>
          <span>Total Bookings: {bookings.length}</span>
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card assigned">
          <div className="stat-number">{stats.assigned}</div>
          <div className="stat-label">Assigned</div>
        </div>
        <div className="stat-card accepted">
          <div className="stat-number">{stats.accepted}</div>
          <div className="stat-label">Accepted</div>
        </div>
        <div className="stat-card in-progress">
          <div className="stat-number">{stats.in_progress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card completed">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card cancelled">
          <div className="stat-number">{stats.cancelled}</div>
          <div className="stat-label">Cancelled</div>
        </div>
      </div>

      <div className="filter-bar">
        <label>Filter by Status:</label>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="accepted">Accepted</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="admin-content">
        {loading && bookings.length === 0 ? (
          <div className="loading">Loading bookings...</div>
        ) : (
          <div className="bookings-grid">
            <div className="bookings-table-container">
              <h2>All Bookings ({filteredBookings.length})</h2>
              <div className="bookings-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Provider</th>
                      <th>Status</th>
                      <th>Scheduled</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} onClick={() => handleSelectBooking(booking)}>
                        <td>#{booking.id}</td>
                        <td>{booking.customer_name}</td>
                        <td>{booking.service_type}</td>
                        <td>{booking.provider_name || 'Unassigned'}</td>
                        <td>
                          <StatusBadge status={booking.status} />
                        </td>
                        <td>{formatDate(booking.scheduled_date)}</td>
                        <td>
                          <button
                            className="btn-view"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectBooking(booking);
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedBooking && (
              <div className="admin-details">
                <div className="details-header">
                  <h2>Booking Management</h2>
                  <button onClick={() => setSelectedBooking(null)}>×</button>
                </div>

                <div className="details-section">
                  <h3>Booking Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <strong>ID:</strong>
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
                    <div className="detail-item full-width">
                      <strong>Address:</strong>
                      <span>{selectedBooking.address}</span>
                    </div>
                    {selectedBooking.provider_name && (
                      <div className="detail-item full-width">
                        <strong>Provider:</strong>
                        <span>{selectedBooking.provider_name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="details-section">
                  <h3>Manual Provider Assignment</h3>
                  <div className="admin-action">
                    <select
                      value={assignProviderId}
                      onChange={(e) => setAssignProviderId(e.target.value)}
                      className="admin-select"
                    >
                      <option value="">Select Provider</option>
                      {providers.map((provider) => (
                        <option key={provider.id} value={provider.id}>
                          {provider.name} - {provider.service_types.join(', ')}
                        </option>
                      ))}
                    </select>
                    <button className="btn btn-primary" onClick={handleManualAssignment}>
                      Assign Provider
                    </button>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Status Override (Admin)</h3>
                  <div className="admin-action">
                    <select
                      value={overrideStatus}
                      onChange={(e) => setOverrideStatus(e.target.value)}
                      className="admin-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="assigned">Assigned</option>
                      <option value="accepted">Accepted</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="rejected">Rejected</option>
                      <option value="no_show">No Show</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Reason for override"
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      className="admin-input"
                    />
                    <button className="btn btn-warning" onClick={handleOverrideStatus}>
                      Override Status
                    </button>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Booking History</h3>
                  <div className="history-timeline">
                    {bookingHistory.length === 0 ? (
                      <p>No history available</p>
                    ) : (
                      bookingHistory.map((entry) => (
                        <div key={entry.id} className="history-entry">
                          <div className="history-time">{formatDate(entry.timestamp)}</div>
                          <div className="history-content">
                            <strong>
                              {entry.old_status ? `${entry.old_status} → ` : ''}
                              {entry.new_status}
                            </strong>
                            <div className="history-meta">
                              By: {entry.changed_by} ({entry.changed_by_role})
                            </div>
                            {entry.reason && <div className="history-reason">{entry.reason}</div>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
