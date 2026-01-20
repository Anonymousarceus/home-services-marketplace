# Architecture Overview

## System Design

### High-Level Architecture
```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │◄────►│   Express    │◄────►│   SQLite    │
│  Frontend   │ HTTP │   Backend    │      │  Database   │
│   (Port     │      │   (Port      │      └─────────────┘
│   3000)     │      │    5000)     │
└─────────────┘      └──────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │  Retry Logic │
                    │  & State     │
                    │  Machine     │
                    └──────────────┘
```

## Backend Architecture

### Layer Structure

```
server.js (Express App)
    │
    ├── routes/
    │   ├── bookings.js (Booking routes)
    │   └── providers.js (Provider routes)
    │
    ├── controllers/
    │   ├── bookingController.js (Business logic)
    │   └── providerController.js (Business logic)
    │
    ├── models/
    │   ├── Booking.js (Data access & state machine)
    │   └── Provider.js (Data access)
    │
    ├── services/
    │   └── assignmentService.js (Retry logic)
    │
    ├── middleware/
    │   └── errorHandler.js (Error handling)
    │
    └── config/
        └── database.js (SQLite setup)
```

### State Machine

The booking lifecycle is managed by a state machine:

```javascript
const STATUS_TRANSITIONS = {
  pending: ['assigned', 'cancelled'],
  assigned: ['accepted', 'rejected', 'cancelled'],
  accepted: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled', 'no_show'],
  rejected: ['assigned', 'cancelled'],
  no_show: ['assigned', 'cancelled'],
  completed: [],
  cancelled: []
};
```

**Key Features:**
- Validates all status transitions
- Prevents invalid state changes
- Admin can override any transition
- Logs every state change in history table

### Retry Logic

Auto-assignment with exponential backoff:

```
Attempt 1: Immediate
Attempt 2: Wait 2 seconds
Attempt 3: Wait 4 seconds
Attempt 4: Wait 8 seconds (max retries)
```

**Triggers for Retry:**
1. Provider rejects booking
2. Provider marked as no-show
3. Initial assignment fails

## Frontend Architecture

### Component Structure

```
App.js (Main container with navigation)
    │
    ├── context/
    │   └── AppContext.js (Global state management)
    │
    ├── pages/
    │   ├── CustomerBooking.js (Customer interface)
    │   ├── ProviderDashboard.js (Provider interface)
    │   └── AdminPanel.js (Admin interface)
    │
    ├── components/
    │   ├── BookingCard.js (Reusable booking display)
    │   └── StatusBadge.js (Status visualization)
    │
    └── services/
        └── api.js (API client with axios)
```

### User Flows

#### Customer Flow
```
1. View existing bookings
2. Create new booking
3. See real-time status updates
4. View booking history
5. Cancel booking (if needed)
```

#### Provider Flow
```
1. Select provider identity
2. View assigned bookings
3. Accept or reject bookings
4. Start service
5. Complete service or mark no-show
```

#### Admin Flow
```
1. View all bookings across system
2. Filter by status
3. Manually assign providers
4. Override any booking status
5. View complete audit trail
```

## Database Schema

### Tables

**bookings**
```sql
- id: INTEGER PRIMARY KEY
- customer_name: TEXT
- customer_phone: TEXT
- customer_email: TEXT
- service_type: TEXT
- address: TEXT
- scheduled_date: TEXT
- status: TEXT (default: 'pending')
- provider_id: INTEGER (FK)
- notes: TEXT
- created_at: DATETIME
- updated_at: DATETIME
```

**providers**
```sql
- id: INTEGER PRIMARY KEY
- name: TEXT
- email: TEXT UNIQUE
- phone: TEXT
- service_types: TEXT (JSON array)
- available: INTEGER (boolean)
- rating: REAL
- created_at: DATETIME
```

**booking_history**
```sql
- id: INTEGER PRIMARY KEY
- booking_id: INTEGER (FK)
- old_status: TEXT
- new_status: TEXT
- changed_by: TEXT
- changed_by_role: TEXT
- reason: TEXT
- timestamp: DATETIME
```

## Key Design Decisions

### 1. State Machine Pattern
**Why:** Ensures booking lifecycle integrity and prevents invalid transitions
**Benefits:** 
- Clear business rules
- Easy to audit
- Prevents data corruption

### 2. Event Sourcing (History Table)
**Why:** Complete observability and audit trail
**Benefits:**
- Debug any issue
- Compliance & accountability
- Time-travel debugging

### 3. Retry Logic with Exponential Backoff
**Why:** Handle transient failures gracefully
**Benefits:**
- Better success rate
- Reduces system load
- User-friendly experience

### 4. Admin Override Capability
**Why:** Real-world operations require manual intervention
**Benefits:**
- Handle edge cases
- Customer support empowerment
- System flexibility

### 5. SQLite Database
**Why:** Simple, serverless, perfect for demo
**Trade-offs:**
- Limited concurrent writes
- Not for production scale
- Easy to upgrade to PostgreSQL/MySQL

## API Design Principles

1. **RESTful conventions**: Standard HTTP methods (GET, POST, PATCH)
2. **Idempotency**: Safe to retry operations
3. **Consistent error handling**: All errors return JSON
4. **Status codes**: Proper HTTP status codes
5. **Versioning ready**: Easy to add `/api/v2/` prefix

## Security Considerations

**Current Implementation (Demo):**
- No authentication (for simplicity)
- CORS enabled for all origins
- Input validation

**Production Requirements:**
- JWT authentication
- Role-based access control (RBAC)
- API rate limiting
- Input sanitization
- HTTPS only
- Database encryption

## Scalability Considerations

**Current Bottlenecks:**
- SQLite (single-threaded writes)
- In-memory state
- No caching

**Production Scaling:**
1. PostgreSQL/MySQL for concurrent access
2. Redis for caching and queues
3. Message queue (RabbitMQ/Kafka) for async tasks
4. Load balancer for multiple backend instances
5. WebSockets for real-time updates
6. CDN for frontend assets

## Testing Strategy

**Unit Tests:**
- Model methods
- State machine transitions
- Retry logic

**Integration Tests:**
- API endpoints
- Database operations
- Error handling

**E2E Tests:**
- Complete user flows
- Multi-step scenarios
- Failure recovery

## Monitoring & Observability

**Current:**
- Console logging
- Booking history table
- Request logging middleware

**Production:**
- APM (Application Performance Monitoring)
- Error tracking (Sentry)
- Log aggregation (ELK stack)
- Metrics (Prometheus/Grafana)
- Alerts for failures

## Future Enhancements

1. **Real-time notifications** (WebSockets)
2. **Payment integration** (Stripe)
3. **Rating & review system**
4. **Provider availability calendar**
5. **Advanced matching algorithm**
6. **Mobile app** (React Native)
7. **Analytics dashboard**
8. **Multi-tenancy support**
