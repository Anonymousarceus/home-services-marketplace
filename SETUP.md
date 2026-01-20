# Setup & Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 16.x or higher)
- **npm** (comes with Node.js)

To check if you have Node.js and npm installed:
```bash
node --version
npm --version
```

## Installation Steps

### Step 1: Install Backend Dependencies

Open a terminal and navigate to the backend folder:

```bash
cd backend
npm install
```

This will install:
- express (web framework)
- cors (cross-origin resource sharing)
- sqlite3 (database)
- uuid (unique identifiers)

### Step 2: Install Frontend Dependencies

Open a **new terminal** and navigate to the frontend folder:

```bash
cd frontend
npm install
```

This will install:
- react & react-dom (UI framework)
- axios (HTTP client)
- react-scripts (build tools)

## Running the Application

### Start Backend Server (Terminal 1)

```bash
cd backend
npm start
```

You should see:
```
╔════════════════════════════════════════════════════════╗
║  Home Services Marketplace - Backend API              ║
║  Server running on http://localhost:5000               ║
║  Database: SQLite                                      ║
║  Status: Ready to accept bookings! 🚀                  ║
╚════════════════════════════════════════════════════════╝
```

The backend will:
- Create a SQLite database (`database.sqlite`)
- Seed 5 sample providers
- Start listening on port 5000

### Start Frontend Server (Terminal 2)

```bash
cd frontend
npm start
```

The React app will:
- Start on http://localhost:3000
- Automatically open in your browser
- Connect to backend at http://localhost:5000

## Using the Application

### 1. Customer Interface

**Create a Booking:**
1. Click "Customer" tab in navigation
2. Click "+ New Booking" button
3. Fill in the form:
   - Your Name
   - Phone Number
   - Service Type (dropdown)
   - Scheduled Date & Time
   - Service Address
   - Additional Notes
4. Click "Create Booking"
5. System will automatically assign a provider

**View Bookings:**
- See all your bookings in the list
- Click on any booking to see details
- View complete booking history
- Cancel bookings if needed

### 2. Provider Interface

**View Assigned Bookings:**
1. Click "Provider" tab
2. Select a provider from dropdown
3. See all bookings assigned to that provider

**Manage Bookings:**
- **Accept/Reject**: For newly assigned bookings
- **Start Service**: When you begin work
- **Complete Service**: When job is done
- **Mark No-Show**: If customer isn't there

### 3. Admin Interface

**System Overview:**
1. Click "Admin" tab
2. See statistics for all bookings
3. View complete system state

**Admin Actions:**
- Filter bookings by status
- Click on any booking to manage
- Manually assign providers
- Override booking status
- View complete audit trail

## Testing Scenarios

### Scenario 1: Happy Path ✅
1. Create booking as customer
2. System auto-assigns provider
3. Switch to provider dashboard
4. Provider accepts booking
5. Provider starts service
6. Provider completes service
7. View history in admin panel

### Scenario 2: Provider Rejection 🔄
1. Create booking
2. Provider rejects with reason
3. System automatically reassigns
4. New provider accepts
5. Service completes

### Scenario 3: Customer Cancellation ❌
1. Create booking
2. Immediately cancel
3. View in admin panel
4. See cancellation in history

### Scenario 4: Admin Override ⚙️
1. Go to admin panel
2. Select any booking
3. Change status manually
4. Add reason
5. View in booking history

## Project Structure

```
Akshat_project/
├── backend/
│   ├── src/
│   │   ├── config/          # Database setup
│   │   ├── models/          # Booking & Provider models
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Error handling
│   │   └── services/        # Retry logic
│   ├── server.js            # Express server
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/      # Reusable UI
│   │   ├── pages/           # Main screens
│   │   ├── context/         # State management
│   │   ├── services/        # API client
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── README.md                # Main documentation
├── API_DOCUMENTATION.md     # API reference
├── ARCHITECTURE.md          # System design
└── SETUP.md                 # This file
```

## Common Issues & Solutions

### Issue: Backend won't start
**Solution:** Make sure port 5000 is not in use
```bash
# Windows
netstat -ano | findstr :5000

# Kill the process using that port if needed
```

### Issue: Frontend can't connect to backend
**Solution:** 
- Ensure backend is running on port 5000
- Check `frontend/package.json` has `"proxy": "http://localhost:5000"`

### Issue: Database errors
**Solution:** Delete `database.sqlite` and restart backend to recreate fresh database

### Issue: npm install fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and try again
rm -rf node_modules
npm install
```

## Development Mode

### Backend with auto-reload:
```bash
cd backend
npm install -D nodemon
npm run dev
```

### Frontend (already has hot reload):
```bash
cd frontend
npm start
```

## API Testing

You can test the API using:

**cURL:**
```bash
curl http://localhost:5000/health
```

**Postman/Insomnia:**
Import the endpoints from `API_DOCUMENTATION.md`

**Browser:**
```
http://localhost:5000/api/bookings
http://localhost:5000/api/providers
```

## Database Management

**View Database:**
You can use any SQLite browser:
- DB Browser for SQLite (recommended)
- SQLite Viewer VS Code extension

**Reset Database:**
```bash
# Stop backend server
# Delete database file
rm database.sqlite

# Restart backend (will recreate with seed data)
cd backend
npm start
```

## Next Steps After Setup

1. ✅ Create a few bookings
2. ✅ Test provider workflow
3. ✅ Try admin overrides
4. ✅ Review booking history
5. ✅ Test error scenarios
6. ✅ Read API_DOCUMENTATION.md
7. ✅ Review ARCHITECTURE.md

## Support

If you encounter any issues:
1. Check terminal console for errors
2. Check browser console (F12)
3. Verify both backend and frontend are running
4. Ensure you're using Node.js 16+

## Production Deployment (Future)

For production deployment, you would:
1. Use PostgreSQL instead of SQLite
2. Add authentication (JWT)
3. Deploy backend to Heroku/AWS/Azure
4. Deploy frontend to Vercel/Netlify
5. Use environment variables for config
6. Add monitoring and logging
7. Set up CI/CD pipeline

---

**Congratulations! 🎉**

You now have a fully functional home services marketplace with:
- ✅ Complete booking lifecycle
- ✅ Provider management
- ✅ Admin controls
- ✅ State machine
- ✅ Retry logic
- ✅ Audit trail
- ✅ Clean architecture

Ready to demonstrate professional full-stack development skills!
