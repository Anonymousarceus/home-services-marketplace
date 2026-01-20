const db = require('../config/database');

class Provider {
  static getAll() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM providers ORDER BY rating DESC';

      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Parse service_types JSON
          const providers = rows.map(p => ({
            ...p,
            service_types: JSON.parse(p.service_types)
          }));
          resolve(providers);
        }
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM providers WHERE id = ?';

      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve({
            ...row,
            service_types: JSON.parse(row.service_types)
          });
        } else {
          resolve(null);
        }
      });
    });
  }

  static getAvailableForService(serviceType) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM providers
        WHERE available = 1
        ORDER BY rating DESC
      `;

      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Filter by service type
          const providers = rows
            .map(p => ({
              ...p,
              service_types: JSON.parse(p.service_types)
            }))
            .filter(p => p.service_types.includes(serviceType));
          
          resolve(providers);
        }
      });
    });
  }

  static updateAvailability(id, available) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE providers SET available = ? WHERE id = ?';

      db.run(query, [available ? 1 : 0, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, available });
        }
      });
    });
  }
}

module.exports = Provider;
