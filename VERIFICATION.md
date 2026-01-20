# Installation Verification Script

## Purpose
This script helps verify that your installation is complete and working correctly.

## Manual Verification Steps

### Step 1: Check Node.js and npm

Open PowerShell and run:

```powershell
node --version
npm --version
```

**Expected Output:**
- Node.js: v16.x.x or higher
- npm: 7.x.x or higher

✅ If you see version numbers, Node.js is installed correctly.
❌ If you get "command not found", install Node.js from https://nodejs.org/

---

### Step 2: Verify Backend Installation

```powershell
cd C:\Users\anand\Desktop\Akshat_project\backend
npm install
```

**Expected Output:**
```
added XX packages, and audited XX packages in XXs
found 0 vulnerabilities
```

✅ If packages install without errors, backend dependencies are ready.
❌ If you see errors, try: `npm cache clean --force` then retry.

---

### Step 3: Verify Frontend Installation

```powershell
cd C:\Users\anand\Desktop\Akshat_project\frontend
npm install
```

**Expected Output:**
```
added XXX packages, and audited XXX packages in XXs
found 0 vulnerabilities
```

✅ If packages install without errors, frontend dependencies are ready.
❌ If you see errors, delete `node_modules` folder and retry.

---

### Step 4: Start Backend Server

```powershell
cd C:\Users\anand\Desktop\Akshat_project\backend
npm start
```

**Expected Output:**
```
Connected to SQLite database
Seeded initial providers
╔════════════════════════════════════════════════════════╗
║  Home Services Marketplace - Backend API              ║
║  Server running on http://localhost:5000               ║
║  Database: SQLite                                      ║
║  Status: Ready to accept bookings! 🚀                  ║
╚════════════════════════════════════════════════════════╝
```

**Test the API:**
Open browser and go to: http://localhost:5000/health

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-20T..."
}
```

✅ If you see the healthy response, backend is working!
❌ If connection fails, check if port 5000 is blocked.

**Keep this terminal open!**

---

### Step 5: Start Frontend Server

Open a **NEW PowerShell window**:

```powershell
cd C:\Users\anand\Desktop\Akshat_project\frontend
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view home-services-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

**Browser should automatically open** to http://localhost:3000

✅ If you see the app with navigation tabs, frontend is working!
❌ If compilation fails, check Node.js version (needs 16+).

---

### Step 6: Test Complete Workflow

#### 6.1 Create a Booking (Customer Interface)
1. Click **"Customer"** tab
2. Click **"+ New Booking"** button
3. Fill out the form:
   - Name: "Test User"
   - Phone: "555-1234"
   - Email: "test@example.com"
   - Service Type: Select "Plumbing"
   - Scheduled Date: Pick tomorrow's date and time
   - Address: "123 Test Street"
   - Notes: "Test booking"
4. Click **"Create Booking"**

**Expected Result:**
✅ Success message: "Booking created successfully! A provider will be assigned shortly."
✅ New booking appears in the list with status "PENDING"
✅ After a moment, status changes to "ASSIGNED"

❌ If booking fails, check backend terminal for errors.

#### 6.2 Provider Accepts (Provider Interface)
1. Click **"Provider"** tab
2. Select **"John Smith"** from dropdown
3. Click on your test booking in the list
4. Click **"Accept Booking"**

**Expected Result:**
✅ Success message: "Booking accepted successfully!"
✅ Status changes to "ACCEPTED"
✅ "Start Service" button appears

#### 6.3 Complete Service
1. Stay on Provider tab
2. Click **"Start Service"**
3. Status changes to "IN_PROGRESS"
4. Click **"Complete Service"**

**Expected Result:**
✅ Success message: "Service completed successfully!"
✅ Status changes to "COMPLETED"

#### 6.4 View History (Admin Interface)
1. Click **"Admin"** tab
2. See statistics showing your completed booking
3. Click on your booking in the table
4. Scroll down to **"Booking History"**

**Expected Result:**
✅ Timeline showing all status changes
✅ Each change shows timestamp, who made it, and why
✅ Complete audit trail from creation to completion

---

### Step 7: Test Error Handling

#### 7.1 Test Provider Rejection
1. Create a new booking (as customer)
2. Go to provider tab
3. Select a provider
4. Click the booking
5. Enter a rejection reason: "Not available"
6. Click **"Reject"**

**Expected Result:**
✅ Success message about reassignment
✅ Booking status becomes "REJECTED"
✅ System attempts to reassign to another provider
✅ Check admin panel to see reassignment in history

#### 7.2 Test Customer Cancellation
1. Create a new booking
2. On customer tab, click the booking
3. Click **"Cancel Booking"**
4. Confirm the dialog

**Expected Result:**
✅ Booking status changes to "CANCELLED"
✅ Cancellation logged in history

#### 7.3 Test Admin Override
1. Go to admin tab
2. Select any booking
3. Choose a different status from dropdown
4. Enter reason: "Manual intervention for testing"
5. Click **"Override Status"**

**Expected Result:**
✅ Status changes to selected value
✅ Override logged in history with "admin" role
✅ Reason is recorded

---

## Verification Checklist

### Installation ✅
- [ ] Node.js 16+ installed
- [ ] Backend dependencies installed (no errors)
- [ ] Frontend dependencies installed (no errors)

### Backend ✅
- [ ] Backend starts without errors
- [ ] Health endpoint responds
- [ ] Database file created (database.sqlite)
- [ ] 5 providers seeded
- [ ] API responds to requests

### Frontend ✅
- [ ] Frontend compiles without errors
- [ ] Browser opens automatically
- [ ] All three tabs visible (Customer, Provider, Admin)
- [ ] UI renders correctly
- [ ] No console errors (press F12 to check)

### Functionality ✅
- [ ] Can create bookings
- [ ] Auto-assignment works
- [ ] Provider can accept bookings
- [ ] Provider can complete service
- [ ] Booking history displays
- [ ] Admin panel shows statistics
- [ ] Admin can override status
- [ ] Error messages display correctly

### Error Handling ✅
- [ ] Provider rejection works
- [ ] Customer cancellation works
- [ ] Admin override works
- [ ] No-show functionality works

---

## Common Issues and Solutions

### Issue: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Issue: "Port 5000 already in use"
**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Issue: "Cannot find module 'express'"
**Solution:**
```powershell
cd backend
rm -r -fo node_modules
rm package-lock.json
npm install
```

### Issue: "React version error"
**Solution:**
```powershell
cd frontend
rm -r -fo node_modules
rm package-lock.json
npm install
```

### Issue: Backend starts but API doesn't respond
**Solution:**
1. Check if port 5000 is blocked by firewall
2. Try accessing http://localhost:5000/health directly
3. Check backend terminal for error messages

### Issue: Frontend can't connect to backend
**Solution:**
1. Verify backend is running on port 5000
2. Check frontend `package.json` has `"proxy": "http://localhost:5000"`
3. Restart frontend after backend is running

### Issue: Database errors
**Solution:**
```powershell
# Stop backend (Ctrl+C)
cd backend
rm database.sqlite
npm start  # Will recreate database
```

---

## Success Indicators

You'll know everything is working when:

✅ Backend shows "Ready to accept bookings!" message
✅ Frontend opens in browser automatically
✅ Can navigate between all three tabs
✅ Can create a booking and see it in the list
✅ Auto-assignment happens within seconds
✅ Provider can accept and complete bookings
✅ Admin can view all bookings and history
✅ No error messages in browser console (F12)
✅ No error messages in backend terminal

---

## Performance Check

### Expected Response Times
- Create booking: < 500ms
- Load bookings list: < 200ms
- Provider actions: < 300ms
- Admin operations: < 400ms

### Expected Database Size
- Fresh database: ~20 KB
- After 10 bookings: ~50 KB
- After 100 bookings: ~200 KB

---

## File Structure Verification

Check that these files exist:

### Backend Files
```
backend/
├── package.json ✅
├── server.js ✅
├── database.sqlite (created on first run) ✅
└── src/
    ├── config/database.js ✅
    ├── models/Booking.js ✅
    ├── models/Provider.js ✅
    ├── controllers/bookingController.js ✅
    ├── controllers/providerController.js ✅
    ├── routes/bookings.js ✅
    ├── routes/providers.js ✅
    ├── services/assignmentService.js ✅
    └── middleware/errorHandler.js ✅
```

### Frontend Files
```
frontend/
├── package.json ✅
├── public/index.html ✅
└── src/
    ├── index.js ✅
    ├── App.js ✅
    ├── context/AppContext.js ✅
    ├── services/api.js ✅
    ├── components/BookingCard.js ✅
    ├── components/StatusBadge.js ✅
    ├── pages/CustomerBooking.js ✅
    ├── pages/ProviderDashboard.js ✅
    └── pages/AdminPanel.js ✅
```

---

## Final Confirmation

If you can complete this workflow successfully, you're ready:

1. ✅ Start backend → See success message
2. ✅ Start frontend → Browser opens
3. ✅ Create booking → Appears in list
4. ✅ Auto-assignment → Status changes to "ASSIGNED"
5. ✅ Provider accepts → Status "ACCEPTED"
6. ✅ Provider completes → Status "COMPLETED"
7. ✅ View in admin → See complete history

**If all steps work → Installation is 100% verified! 🎉**

---

## Next Steps After Verification

1. ✅ Read [QUICKSTART.md](QUICKSTART.md) for usage guide
2. ✅ Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
3. ✅ Study [ARCHITECTURE.md](ARCHITECTURE.md) for system design
4. ✅ Practice demo using [INTERVIEW_PREP.md](INTERVIEW_PREP.md)
5. ✅ Test all scenarios from [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

---

## Support

If something isn't working:
1. Check the error message carefully
2. Look in the "Common Issues" section above
3. Check backend terminal for error details
4. Check browser console (F12) for frontend errors
5. Verify Node.js version is 16 or higher
6. Try the database reset solution
7. Make sure both terminals are running

---

## You're All Set! 🚀

If all checks pass, you have a fully functional, production-quality application ready to demonstrate!

**Time to prepare for your interview!** 💪
