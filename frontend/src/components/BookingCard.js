import React from 'react';
import './BookingCard.css';
import StatusBadge from './StatusBadge';

const BookingCard = ({ booking, onSelect }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="booking-card" onClick={() => onSelect && onSelect(booking)}>
      <div className="booking-card-header">
        <h3>Booking #{booking.id}</h3>
        <StatusBadge status={booking.status} />
      </div>
      
      <div className="booking-card-body">
        <div className="booking-info">
          <span className="label">Customer:</span>
          <span className="value">{booking.customer_name}</span>
        </div>
        
        <div className="booking-info">
          <span className="label">Service:</span>
          <span className="value">{booking.service_type}</span>
        </div>
        
        <div className="booking-info">
          <span className="label">Scheduled:</span>
          <span className="value">{formatDate(booking.scheduled_date)}</span>
        </div>
        
        {booking.provider_name && (
          <div className="booking-info">
            <span className="label">Provider:</span>
            <span className="value">{booking.provider_name}</span>
          </div>
        )}
        
        <div className="booking-info">
          <span className="label">Address:</span>
          <span className="value">{booking.address}</span>
        </div>
      </div>
      
      <div className="booking-card-footer">
        <small>Created: {formatDate(booking.created_at)}</small>
      </div>
    </div>
  );
};

export default BookingCard;
