# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### Bookings

#### Create Booking
```http
POST /api/bookings
Content-Type: application/json

{
  "customer_name": "John Doe",
  "customer_phone": "+1-555-1234",
  "customer_email": "john@example.com",
  "service_type": "plumbing",
  "address": "123 Main St, City, State",
  "scheduled_date": "2026-01-25T10:00:00",
  "notes": "Leaking faucet in kitchen"
}
```

**Response:**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": 1,
    "customer_name": "John Doe",
    "status": "pending",
    ...
  }
}
```

#### Get All Bookings
```http
GET /api/bookings
```

#### Get Booking by ID
```http
GET /api/bookings/:id
```

#### Get Booking History
```http
GET /api/bookings/:id/history
```

**Response:**
```json
{
  "history": [
    {
      "id": 1,
      "booking_id": 1,
      "old_status": null,
      "new_status": "pending",
      "changed_by": "customer",
      "changed_by_role": "customer",
      "reason": "Booking created",
      "timestamp": "2026-01-20T10:00:00.000Z"
    }
  ]
}
```

#### Cancel Booking
```http
PATCH /api/bookings/:id/cancel
Content-Type: application/json

{
  "cancelled_by": "customer",
  "reason": "Changed my mind"
}
```

#### Assign Provider (Manual)
```http
PATCH /api/bookings/:id/assign
Content-Type: application/json

{
  "provider_id": 1
}
```

### Provider Workflow

#### Accept Booking
```http
PATCH /api/bookings/:id/accept
Content-Type: application/json

{
  "provider_id": 1
}
```

#### Reject Booking
```http
PATCH /api/bookings/:id/reject
Content-Type: application/json

{
  "provider_id": 1,
  "reason": "Not available at that time"
}
```

#### Start Service
```http
PATCH /api/bookings/:id/start
Content-Type: application/json

{
  "provider_id": 1
}
```

#### Complete Service
```http
PATCH /api/bookings/:id/complete
Content-Type: application/json

{
  "provider_id": 1,
  "notes": "Fixed the leaking faucet"
}
```

#### Mark No-Show
```http
PATCH /api/bookings/:id/no-show
Content-Type: application/json

{
  "provider_id": 1,
  "reason": "Customer was not home"
}
```

### Admin Operations

#### Override Status
```http
PATCH /api/bookings/:id/override
Content-Type: application/json

{
  "new_status": "completed",
  "admin_name": "Admin User",
  "reason": "Manual completion by support team"
}
```

### Providers

#### Get All Providers
```http
GET /api/providers
```

**Response:**
```json
{
  "providers": [
    {
      "id": 1,
      "name": "John Smith",
      "email": "john@example.com",
      "phone": "+1-555-0101",
      "service_types": ["plumbing", "electrical"],
      "available": 1,
      "rating": 5.0
    }
  ]
}
```

#### Get Provider by ID
```http
GET /api/providers/:id
```

#### Update Availability
```http
PATCH /api/providers/:id/availability
Content-Type: application/json

{
  "available": true
}
```

## Status Flow

```
pending 
  ↓ (auto-assignment)
assigned 
  ↓ (provider accepts)
accepted 
  ↓ (provider starts)
in_progress 
  ↓ (provider completes)
completed

Alternative flows:
- Any status → cancelled (customer/provider cancels)
- assigned → rejected (provider rejects) → assigned (reassignment)
- in_progress → no_show (provider marks no-show)
```

## Error Responses

All errors return JSON in this format:
```json
{
  "error": "Error message describing what went wrong"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error
