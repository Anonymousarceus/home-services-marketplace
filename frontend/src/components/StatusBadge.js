import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  const getStatusClass = () => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'assigned':
        return 'status-assigned';
      case 'accepted':
        return 'status-accepted';
      case 'in_progress':
        return 'status-in-progress';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      case 'rejected':
        return 'status-rejected';
      case 'no_show':
        return 'status-no-show';
      default:
        return 'status-default';
    }
  };

  const getStatusLabel = () => {
    return status.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <span className={`status-badge ${getStatusClass()}`}>
      {getStatusLabel()}
    </span>
  );
};

export default StatusBadge;
