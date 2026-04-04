# Wallet & Redemption Module - Backend

## Overview
The Wallet & Redemption backend module handles point management, transaction tracking, and reward redemption functionality for the ElevateX platform.

## Features
- **Balance Management**: Track user points (earned, redeemed, total)
- **Transaction History**: Log all point transactions with timestamps
- **Reward Catalog**: Manage available rewards with inventory tracking
- **Redemption System**: Allow users to redeem rewards using their points
- **Badge System**: Track user achievements and badges

## Project Structure

```
backend/
├── models/
│   ├── __init__.py
│   └── wallet.py              # Pydantic models for requests/responses
├── routers/
│   ├── __init__.py
│   └── wallet.py              # API endpoints for wallet operations
├── services/
│   ├── __init__.py
│   └── wallet_service.py       # Business logic for wallet operations
└── README.md
```

## API Endpoints

### Get User Balance
```http
GET /api/wallet/balance
Authorization: Bearer <token>
```

**Response:**
```json
{
  "total_points": 1500,
  "earned_points": 2000,
  "redeemed_points": 500,
  "badges": ["First Steps", "Achiever"],
  "transaction_count": 15
}
```

### Get Transaction History
```http
GET /api/wallet/transactions
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "user_id": "507f1f77bcf86cd799439010",
    "type": "earn",
    "amount": 100,
    "description": "Completed Event: Web Development Basics",
    "reference_id": "507f1f77bcf86cd799439012",
    "timestamp": "2024-04-04T10:30:00"
  }
]
```

### Get Available Rewards
```http
GET /api/wallet/rewards
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439013",
    "name": "Amazon Gift Card $50",
    "description": "Digital gift card for Amazon",
    "cost_points": 500,
    "category": "gift-cards",
    "inventory": 10,
    "image_url": "https://..."
  }
]
```

### Redeem a Reward
```http
POST /api/wallet/redeem
Authorization: Bearer <token>
Content-Type: application/json

{
  "reward_id": "507f1f77bcf86cd799439013"
}
```

**Response:**
```json
{
  "message": "Successfully redeemed Amazon Gift Card $50"
}
```

## Database Collections

### transactions
```javascript
{
  _id: ObjectId,
  user_id: String,           // User ID as string
  type: "earn" | "redeem",
  amount: Number,
  description: String,
  reference_id: String,      // Links to event/submission/reward
  timestamp: Date
}
```

### rewards
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  cost_points: Number,
  category: String,          // e.g., "gift-cards", "merchandise"
  inventory: Number,
  image_url: String,
  created_at: Date
}
```

## Dependencies

- `FastAPI`: Web framework
- `motor`: Async MongoDB driver
- `pydantic`: Data validation
- `python-jose`: JWT handling
- `passlib`: Password hashing

## Integration Points

The Wallet module integrates with:
- **Auth Module**: User authentication and JWT validation
- **User Model**: Points stored in users collection
- **Event Submissions**: Points awarded on submission approval
- **Analytics**: Transaction data for insights

## Error Handling

| Status | Error | Description |
|--------|-------|-------------|
| 401 | Unauthorized | Missing or invalid token |
| 404 | Reward not found | Reward ID doesn't exist |
| 400 | Insufficient points | User doesn't have enough points |
| 400 | Out of stock | Reward inventory is zero |

## Future Enhancements

- [ ] Reward expiration system
- [ ] Point decay/expiration rules
- [ ] Reward recommendations based on user activity
- [ ] Bulk reward redemption for admins
- [ ] Point transfer between users
- [ ] Custom reward creation for admins
- [ ] Tiered rewards system
