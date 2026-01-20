# ⚡ Quick Start Guide

Get the application running in 5 minutes!

## Prerequisites Check

```bash
node --version    # Should be 16.x or higher
npm --version     # Should be 7.x or higher
```

## Installation (One-Time Setup)

### Terminal 1 - Backend Setup
```bash
cd backend
npm install
```

### Terminal 2 - Frontend Setup
```bash
cd frontend
npm install
```

## Running the Application

### Terminal 1 - Start Backend
```bash
cd backend
npm start
```

**Expected Output:**
```
╔════════════════════════════════════════════════════════╗
║  Home Services Marketplace - Backend API              ║
║  Server running on http://localhost:5000               ║
║  Database: SQLite                                      ║
║  Status: Ready to accept bookings! 🚀                  ║
╚════════════════════════════════════════════════════════╝
```

### Terminal 2 - Start Frontend
```bash
cd frontend
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view home-services-frontend in the browser.

  Local:            http://localhost:3000
```

## First Steps

1. **Browser opens automatically** at http://localhost:3000
2. **You'll see three tabs**: Customer, Provider, Admin
3. **Start with Customer tab**: Click "+ New Booking"

## Quick Test Scenario

### Step 1: Create a Booking (30 seconds)
1. Click **"Customer"** tab
2. Click **"+ New Booking"** button
3. Fill the form:
   - **Name**: John Doe
   - **Phone**: 555-1234
   - **Service**: Plumbing (dropdown)
   - **Date**: Pick tomorrow at 10:00 AM
   - **Address**: 123 Main Street
4. Click **"Create Booking"**
5. ✅ You'll see "Booking created successfully!"

### Step 2: Provider Accepts (20 seconds)
1. Click **"Provider"** tab
2. Select a provider from dropdown (try "John Smith")
3. Click on the booking you just created
4. Click **"Accept Booking"**
5. ✅ Status changes to ACCEPTED

### Step 3: Complete Service (15 seconds)
1. Stay on Provider tab
2. Click **"Start Service"**
3. Status changes to IN_PROGRESS
4. Click **"Complete Service"**
5. ✅ Status changes to COMPLETED

### Step 4: View History (10 seconds)
1. Click **"Admin"** tab
2. Click on your booking in the table
3. Scroll down to **"Booking History"**
4. ✅ See complete timeline of all status changes!

## Quick Reference

### Backend API Endpoints
```
GET    /api/bookings           # List all bookings
POST   /api/bookings           # Create booking
GET    /api/bookings/:id       # Get booking details
PATCH  /api/bookings/:id/*     # Update booking
GET    /api/providers          # List providers
```

### Service Types Available
- Plumbing
- Electrical
- Cleaning
- Painting
- HVAC
- Carpentry
- Gardening

### Pre-seeded Providers
1. **John Smith** - Plumbing, Electrical
2. **Sarah Johnson** - Cleaning, Painting
3. **Mike Davis** - Plumbing, HVAC
4. **Emily Brown** - Cleaning, Gardening
5. **Robert Wilson** - Electrical, Carpentry

## Testing Different Scenarios

### Scenario: Provider Rejection
1. Create booking
2. Provider tab → Reject booking (enter reason)
3. ✅ System auto-reassigns to another provider

### Scenario: Customer Cancellation
1. Create booking
2. Customer tab → Click booking → Cancel
3. ✅ Booking status changes to CANCELLED

### Scenario: Admin Override
1. Admin tab → Select any booking
2. Choose new status from dropdown
3. Enter reason
4. Click "Override Status"
5. ✅ Status changes with admin note in history

### Scenario: No-Show
1. Provider accepts booking
2. Provider starts service
3. Click "Mark No-Show"
4. ✅ Booking marked as NO_SHOW, can be reassigned

## Troubleshooting

### Port Already in Use
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# Or change port in backend/server.js
const PORT = process.env.PORT || 5001;
```

### Database Reset
```bash
# Stop backend (Ctrl+C)
# Delete database file
rm backend/database.sqlite

# Restart backend
cd backend
npm start
```

### Frontend Not Connecting
Check that:
- Backend is running on port 5000
- Frontend `package.json` has `"proxy": "http://localhost:5000"`
- No firewall blocking localhost

### Clear & Reinstall
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Project Structure Quick View

```
📁 Akshat_project/
├── 📁 backend/          → Node.js + Express API
│   ├── server.js        → Entry point
│   └── src/             → All backend code
│
├── 📁 frontend/         → React application
│   └── src/             → All frontend code
│
├── README.md            → Project overview
├── SETUP.md             → Detailed setup
├── API_DOCUMENTATION.md → API reference
└── ARCHITECTURE.md      → System design
```

## Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | User interface |
| Backend API | http://localhost:5000/api | REST API |
| Health Check | http://localhost:5000/health | Server status |
| Bookings API | http://localhost:5000/api/bookings | Bookings data |
| Providers API | http://localhost:5000/api/providers | Providers data |

## Next Steps

1. ✅ Run the quick test scenario above
2. ✅ Explore all three user interfaces
3. ✅ Check the booking history feature
4. ✅ Read API_DOCUMENTATION.md for API details
5. ✅ Read ARCHITECTURE.md for system design
6. ✅ Review the code to understand implementation

## Demo Script for Interview

**1. Introduction (30 seconds)**
"I built a full-stack home services marketplace handling the complete booking lifecycle with state management, retry logic, and complete observability."

**2. Live Demo (2-3 minutes)**
- Show customer creating booking
- Show provider accepting
- Show admin panel with statistics
- Show complete booking history

**3. Technical Highlights (1-2 minutes)**
- "Implemented state machine for status transitions"
- "Added retry logic with exponential backoff"
- "Event sourcing for complete audit trail"
- "Admin can override for operational flexibility"

**4. Code Walkthrough (if asked)**
- Show state machine in Booking.js
- Show retry logic in assignmentService.js
- Show component structure in React

## Support & Documentation

- **Full Setup Guide**: See SETUP.md
- **API Reference**: See API_DOCUMENTATION.md
- **System Design**: See ARCHITECTURE.md
- **Project Summary**: See PROJECT_SUMMARY.md
- **Visual Diagrams**: See DIAGRAMS.md

---

## That's it! You're ready to go! 🚀

**Time to first booking: < 5 minutes**

The application is:
- ✅ Fully functional
- ✅ Production-ready patterns
- ✅ Well documented
- ✅ Interview ready

**Good luck!** 💪
