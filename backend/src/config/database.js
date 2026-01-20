const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Create providers table
    db.run(`
      CREATE TABLE IF NOT EXISTS providers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        service_types TEXT NOT NULL,
        available INTEGER DEFAULT 1,
        rating REAL DEFAULT 5.0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create bookings table
    db.run(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_email TEXT,
        service_type TEXT NOT NULL,
        address TEXT NOT NULL,
        scheduled_date TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        provider_id INTEGER,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (provider_id) REFERENCES providers(id)
      )
    `);

    // Create booking_history table for observability
    db.run(`
      CREATE TABLE IF NOT EXISTS booking_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id INTEGER NOT NULL,
        old_status TEXT,
        new_status TEXT NOT NULL,
        changed_by TEXT NOT NULL,
        changed_by_role TEXT NOT NULL,
        reason TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES bookings(id)
      )
    `);

    // Seed initial providers
    seedProviders();
  });
}

function seedProviders() {
  const providers = [
    {
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1-555-0101',
      service_types: JSON.stringify(['plumbing', 'electrical'])
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1-555-0102',
      service_types: JSON.stringify(['cleaning', 'painting'])
    },
    {
      name: 'Mike Davis',
      email: 'mike@example.com',
      phone: '+1-555-0103',
      service_types: JSON.stringify(['plumbing', 'hvac'])
    },
    {
      name: 'Emily Brown',
      email: 'emily@example.com',
      phone: '+1-555-0104',
      service_types: JSON.stringify(['cleaning', 'gardening'])
    },
    {
      name: 'Robert Wilson',
      email: 'robert@example.com',
      phone: '+1-555-0105',
      service_types: JSON.stringify(['electrical', 'carpentry'])
    }
  ];

  const checkQuery = 'SELECT COUNT(*) as count FROM providers';
  db.get(checkQuery, [], (err, row) => {
    if (err) {
      console.error('Error checking providers:', err);
      return;
    }

    if (row.count === 0) {
      const insertQuery = `
        INSERT INTO providers (name, email, phone, service_types)
        VALUES (?, ?, ?, ?)
      `;

      providers.forEach(provider => {
        db.run(insertQuery, [
          provider.name,
          provider.email,
          provider.phone,
          provider.service_types
        ]);
      });

      console.log('Seeded initial providers');
    }
  });
}

module.exports = db;
