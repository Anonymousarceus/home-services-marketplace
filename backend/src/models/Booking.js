const db = require('../config/database');

// Valid status transitions for state machine
const STATUS_TRANSITIONS = {
  pending: ['assigned', 'cancelled'],
  assigned: ['assigned', 'accepted', 'rejected', 'cancelled'],
  accepted: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled', 'no_show'],
  rejected: ['assigned', 'cancelled'],
  no_show: ['assigned', 'cancelled'],
  completed: [],
  cancelled: []
};

class Booking {
  static create(bookingData) {
    return new Promise((resolve, reject) => {
      const { customer_name, customer_phone, customer_email, service_type, address, scheduled_date, notes } = bookingData;
      
      const query = `
        INSERT INTO bookings (customer_name, customer_phone, customer_email, service_type, address, scheduled_date, notes, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
      `;

      db.run(query, [customer_name, customer_phone, customer_email, service_type, address, scheduled_date, notes], function(err) {
        if (err) {
          reject(err);
        } else {
          // Log the creation in history
          Booking.addHistory(this.lastID, null, 'pending', 'customer', 'customer', 'Booking created');
          resolve(this.lastID);
        }
      });
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT b.*, p.name as provider_name, p.phone as provider_phone
        FROM bookings b
        LEFT JOIN providers p ON b.provider_id = p.id
        ORDER BY b.created_at DESC
      `;

      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT b.*, p.name as provider_name, p.email as provider_email, p.phone as provider_phone
        FROM bookings b
        LEFT JOIN providers p ON b.provider_id = p.id
        WHERE b.id = ?
      `;

      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static getByProvider(providerId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM bookings
        WHERE provider_id = ?
        ORDER BY created_at DESC
      `;

      db.all(query, [providerId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static updateStatus(id, newStatus, changedBy, changedByRole, reason = '') {
    return new Promise(async (resolve, reject) => {
      try {
        const booking = await Booking.getById(id);
        if (!booking) {
          return reject(new Error('Booking not found'));
        }

        const oldStatus = booking.status;

        // Validate state transition (unless it's an admin override)
        if (changedByRole !== 'admin' && !STATUS_TRANSITIONS[oldStatus]?.includes(newStatus)) {
          return reject(new Error(`Invalid status transition from ${oldStatus} to ${newStatus}`));
        }

        const query = `
          UPDATE bookings
          SET status = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `;

        db.run(query, [newStatus, id], function(err) {
          if (err) {
            reject(err);
          } else {
            // Log the status change
            Booking.addHistory(id, oldStatus, newStatus, changedBy, changedByRole, reason);
            resolve({ id, oldStatus, newStatus });
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static assignProvider(bookingId, providerId, changedBy = 'system', reason = 'Auto-assignment') {
    return new Promise(async (resolve, reject) => {
      try {
        const booking = await Booking.getById(bookingId);
        if (!booking) {
          return reject(new Error('Booking not found'));
        }

        const query = `
          UPDATE bookings
          SET provider_id = ?, status = 'assigned', updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `;

        db.run(query, [providerId, bookingId], function(err) {
          if (err) {
            reject(err);
          } else {
            Booking.updateStatus(bookingId, 'assigned', changedBy, 'system', reason);
            resolve({ bookingId, providerId });
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static addHistory(bookingId, oldStatus, newStatus, changedBy, changedByRole, reason) {
    const query = `
      INSERT INTO booking_history (booking_id, old_status, new_status, changed_by, changed_by_role, reason)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(query, [bookingId, oldStatus, newStatus, changedBy, changedByRole, reason], (err) => {
      if (err) {
        console.error('Error adding booking history:', err);
      }
    });
  }

  static getHistory(bookingId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM booking_history
        WHERE booking_id = ?
        ORDER BY timestamp ASC
      `;

      db.all(query, [bookingId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static canTransition(fromStatus, toStatus) {
    return STATUS_TRANSITIONS[fromStatus]?.includes(toStatus) || false;
  }
}

module.exports = Booking;
