import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Booking API
export const bookingAPI = {
  createBooking: (data) => api.post('/bookings', data),
  getAllBookings: () => api.get('/bookings'),
  getBooking: (id) => api.get(`/bookings/${id}`),
  getBookingHistory: (id) => api.get(`/bookings/${id}/history`),
  cancelBooking: (id, data) => api.patch(`/bookings/${id}/cancel`, data),
  assignProvider: (id, providerId) => api.patch(`/bookings/${id}/assign`, { provider_id: providerId }),
  acceptBooking: (id, providerId) => api.patch(`/bookings/${id}/accept`, { provider_id: providerId }),
  rejectBooking: (id, providerId, reason) => api.patch(`/bookings/${id}/reject`, { provider_id: providerId, reason }),
  startService: (id, providerId) => api.patch(`/bookings/${id}/start`, { provider_id: providerId }),
  completeService: (id, providerId, notes) => api.patch(`/bookings/${id}/complete`, { provider_id: providerId, notes }),
  markNoShow: (id, providerId, reason) => api.patch(`/bookings/${id}/no-show`, { provider_id: providerId, reason }),
  overrideStatus: (id, newStatus, adminName, reason) => api.patch(`/bookings/${id}/override`, { 
    new_status: newStatus, 
    admin_name: adminName, 
    reason 
  })
};

// Provider API
export const providerAPI = {
  getAllProviders: () => api.get('/providers'),
  getProvider: (id) => api.get(`/providers/${id}`),
  updateAvailability: (id, available) => api.patch(`/providers/${id}/availability`, { available })
};

export default api;
