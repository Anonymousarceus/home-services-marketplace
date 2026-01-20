const express = require('express');
const cors = require('cors');
const bookingRoutes = require('./src/routes/bookings');
const providerRoutes = require('./src/routes/providers');
const { errorHandler, requestLogger, notFoundHandler } = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/providers', providerRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  Home Services Marketplace - Backend API              ║
║  Server running on http://localhost:${PORT}            ║
║  Database: SQLite                                      ║
║  Status: Ready to accept bookings! 🚀                  ║
╚════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
