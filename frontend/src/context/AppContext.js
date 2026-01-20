import React, { createContext, useContext, useState, useCallback } from 'react';
import { bookingAPI, providerAPI } from '../services/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookingAPI.getAllBookings();
      setBookings(response.data.bookings);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await providerAPI.getAllProviders();
      setProviders(response.data.providers);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch providers');
      console.error('Error fetching providers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = async (bookingData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookingAPI.createBooking(bookingData);
      await fetchBookings();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    bookings,
    providers,
    loading,
    error,
    fetchBookings,
    fetchProviders,
    createBooking,
    setError
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
