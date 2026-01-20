# ServiceHub Pro - Home Services Marketplace

A professional, full-stack web application for connecting customers with trusted service providers. Built with React, Node.js, Express, and SQLite.

![ServiceHub Pro](https://img.shields.io/badge/ServiceHub-Pro-blue)
![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-green)
![Backend](https://img.shields.io/badge/backend-Node.js%20%2B%20Express-green)
![Frontend](https://img.shields.io/badge/frontend-React%2018-blue)
![Database](https://img.shields.io/badge/database-SQLite-orange)

A comprehensive home services marketplace platform featuring modern UI/UX design, real-time booking management, and intelligent provider assignment system.

---

## 🎯 Features Implemented

### Core Functionality
✅ **Booking Creation** - Customers can request services  
✅ **Provider Assignment** - Automatic assignment with provider acceptance workflow  
✅ **Booking Lifecycle** - Complete state machine (pending → assigned → in-progress → completed)  
✅ **Provider Workflow** - Accept, reject, or view assigned bookings  
✅ **Failure Handling** - Cancellations, no-shows, rejections with retry logic  
✅ **Manual Intervention** - Admin can override any booking state  
✅ **Observability** - Complete booking history and event logs  

### Status Flow
```
pending → assigned → accepted → in-progress → completed
    ↓         ↓          ↓            ↓
cancelled  rejected  cancelled   cancelled
```

## 🏗️ Architecture

- **Backend**: Node.js + Express + SQLite
- **Frontend**: React + Axios
- **State Management**: React Context API
- **Database**: SQLite with full transaction support

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── models/      # Data models & schema
│   │   ├── routes/      # API routes
│   │   ├── controllers/ # Business logic
│   │   ├── middleware/  # Error handling, validation
│   │   └── services/    # State machine & retry logic
│   └── server.js        # Express server
├── frontend/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Main screens
│       ├── context/     # Global state
│       └── services/    # API client
└── README.md
```

## 🎬 Quick Demo

Watch the system in action:
1. **Customer creates booking** → Auto-assigned to provider
2. **Provider accepts** → Updates to "Accepted" status
3. **Provider completes** → Booking marked complete
4. **Admin views history** → Complete audit trail visible

Everything tracked, logged, and observable!

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Install Backend Dependencies**
```bash
cd backend
npm install
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

### Running the Application

1. **Start Backend** (Terminal 1)
```bash
cd backend
npm start
```
Backend runs on `http://localhost:5000`

2. **Start Frontend** (Terminal 2)
```bash
cd frontend
npm start
```
Frontend runs on `http://localhost:3000`

## 📱 User Interfaces

### 1. Customer Booking Screen
- Create new service bookings
- View all bookings with real-time status
- Cancel bookings
- See booking details and history

### 2. Provider Dashboard
- View assigned bookings
- Accept or reject bookings
- Update booking status (start, complete)
- Mark no-shows

### 3. Admin/Ops Panel
- View all bookings across the system
- Manual state override capabilities
- Complete booking history with timestamps
- System-wide observability

## 🔧 API Endpoints

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - List all bookings
- `GET /api/bookings/:id` - Get booking details
- `GET /api/bookings/:id/history` - Get booking history
- `PATCH /api/bookings/:id/cancel` - Cancel booking
- `PATCH /api/bookings/:id/assign` - Assign provider (auto)

### Provider Workflow
- `GET /api/providers` - List providers
- `PATCH /api/bookings/:id/accept` - Accept booking
- `PATCH /api/bookings/:id/reject` - Reject booking
- `PATCH /api/bookings/:id/start` - Start service
- `PATCH /api/bookings/:id/complete` - Complete service
- `PATCH /api/bookings/:id/no-show` - Mark no-show

### Admin
- `PATCH /api/bookings/:id/override` - Manual state override

## 🎨 Key Technical Highlights

### 1. State Machine Implementation
Robust state transition validation ensuring business rules are enforced.

### 2. Retry Logic
Automatic retry for provider assignment with exponential backoff.

### 3. Event Logging
Every state change is logged with timestamp, actor, and reason.

### 4. Error Handling
Graceful error handling with meaningful messages throughout the stack.

### 5. Transaction Safety
Database transactions ensure data consistency.

## 🧪 Testing the System

### Scenario 1: Happy Path
1. Create booking as customer
2. System auto-assigns provider
3. Provider accepts booking
4. Provider starts service
5. Provider completes service

### Scenario 2: Provider Rejection
1. Create booking
2. Provider rejects
3. System auto-reassigns to another provider
4. New provider accepts and completes

### Scenario 3: Customer Cancellation
1. Create booking
2. Customer cancels before provider starts

### Scenario 4: Admin Override
1. Any booking in any state
2. Admin manually changes state
3. History logs the manual intervention

## 📊 Database Schema

### bookings
- id, customer_name, customer_phone, service_type
- status, provider_id, scheduled_date, address
- created_at, updated_at

### providers
- id, name, email, phone, service_types (JSON)
- available, rating, created_at

### booking_history
- id, booking_id, old_status, new_status
- changed_by, changed_by_role, reason
- timestamp

## 🔐 Future Enhancements
- Authentication & Authorization
- Real-time notifications (WebSockets)
- Payment integration
- Provider availability calendar
- Customer ratings & reviews
- Advanced matching algorithms

## 👨‍💻 Developer Notes

This project demonstrates:
- Clean architecture principles
- RESTful API design
- State machine patterns
- Error handling best practices
- React component composition
- Responsive UI design
- Full-stack integration

Built with ❤️ for Full Stack Engineering Internship
