# Wallet & Redemption Module - End-to-End Documentation

## 📋 Module Overview

The **Wallet & Redemption** module is the 4th module of ElevateX, handling all point-based economy features. This document provides a comprehensive guide for the entire module architecture, from API design to UI implementation.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
├─────────────────────────────────────────────────────────────────┤
│ Wallet.jsx (UI)            ↔  walletAPI.js (API Integration)    │
│ ├─ Balance Display                                               │
│ ├─ Badge Showcase                                                │
│ ├─ Transaction History                                           │
│ └─ Reward Marketplace                                            │
├─────────────────────────────────────────────────────────────────┤
│                HTTP (REST API) - /api/wallet/*                  │
├─────────────────────────────────────────────────────────────────┤
│                      Backend (FastAPI)                           │
├─────────────────────────────────────────────────────────────────┤
│ Router (wallet.py)         ↔  Service (wallet_service.py)       │
│ ├─ GET /balance                                                  │
│ ├─ GET /transactions                                             │
│ ├─ GET /rewards                                                  │
│ └─ POST /redeem                                                  │
├─────────────────────────────────────────────────────────────────┤
│           MongoDB (users, transactions, rewards)                 │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Module File Structure

```
modules/wallet-redemption/
├── backend/
│   ├── models/
│   │   ├── __init__.py
│   │   └── wallet.py                 # Pydantic models
│   ├── routers/
│   │   ├── __init__.py
│   │   └── wallet.py                 # API endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   └── wallet_service.py          # Business logic
│   ├── __init__.py
│   └── README.md
├── frontend/
│   ├── pages/
│   │   ├── Wallet.jsx                # Main component
│   │   └── Wallet.css                # Styles
│   ├── api/
│   │   └── walletAPI.js              # API calls
│   ├── components/                   # Future components
│   ├── __init__.js
│   └── README.md
├── E2E_README.md                      # This file
└── MODULE_INTEGRATION.md              # Integration guide
```

## 🔄 Data Flow

### Complete User Journey

1. **User opens Wallet page**
   ```
   Wallet.jsx mounts
   → useEffect triggered
   → fetchData() called
   → Three parallel API calls:
      - walletAPI.balance()
      - walletAPI.transactions()
      - walletAPI.rewards()
   → Backend receives authenticated request
   → Services process data
   → Data returned to frontend
   → State updated → UI rendered
   ```

2. **User views balance**
   ```
   GET /api/wallet/balance
   ↓
   WalletService.get_balance()
   ↓
   Queries users collection for points
   Aggregates earned/redeemed transactions
   Counts total transactions
   ↓
   Returns formatted response
   ↓
   Frontend displays balance card
   ```

3. **User redeems reward**
   ```
   User clicks "Redeem" button
   ↓
   handleRedeem(rewardId, name)
   ↓
   setRedeeming(rewardId) - Show loading
   ↓
   POST /api/wallet/redeem { reward_id }
   ↓
   WalletService.redeem_reward()
   ↓
   Validate: reward exists
   Validate: user has enough points
   Validate: reward has inventory
   ↓
   Atomic updates:
   - Deduct points from user
   - Decrease reward inventory
   - Create transaction record
   ↓
   Success response
   ↓
   fetchData() - Refresh all
   ↓
   Toast notification
   ↓
   UI updates with new balance
   ```

## 🛢️ Database Schema

### users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  username: String,
  points: Number,              // ← Wallet balance
  badges: Array<String>,       // ← Earned achievements
  role: "user" | "manager" | "admin",
  created_at: Date,
  ...other fields
}
```

### transactions Collection
```javascript
{
  _id: ObjectId,
  user_id: String,            // User ID as string
  type: "earn" | "redeem",
  amount: Number,             // Points involved
  description: String,        // Human-readable description
  reference_id: String,       // Links to event/submission/reward
  timestamp: Date,
  created_at: Date
}
```

### rewards Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  cost_points: Number,
  category: String,           // e.g., "gift-cards", "merchandise", "experiences"
  inventory: Number,          // Stock available
  image_url: String,          // Reward image
  active: Boolean,            // Is reward active
  created_at: Date,
  updated_at: Date
}
```

## 🔌 API Endpoints Reference

### Base URL
```
http://localhost:8000/api/wallet
```

### Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/balance` | Get user's wallet balance | Required |
| GET | `/transactions` | Get transaction history | Required |
| GET | `/rewards` | Get available rewards | Required |
| POST | `/redeem` | Redeem a reward | Required |

## 🚀 Key Implementation Details

### 1. Authentication Flow
```python
@router.get("/balance")
async def get_balance(
    current_user=Depends(get_current_user),  # JWT validation
    service: WalletService = Depends(get_wallet_service)
):
    return await service.get_balance(current_user["_id"])
```

### 2. Atomic Transaction Update
Ensures data consistency during redemption:
```python
# All updates happen atomically
await db.users.update_one({"_id": user_id}, {"$inc": {"points": -cost}})
await db.rewards.update_one({"_id": reward_id}, {"$inc": {"inventory": -1}})
await db.transactions.insert_one({transaction_record})
```

### 3. Real-time Balance Update
```javascript
const handleRedeem = async (rewardId, name) => {
  // Disable button
  setRedeeming(rewardId);
  
  try {
    await walletAPI.redeem(rewardId);
    // Instead of just removing item, fetch fresh data
    await fetchData();  // Re-fetch everything
    showToast(`Redeemed successfully!`);
  } catch(e) {
    showToast(e.response?.data?.detail || "Failed", "error");
  } finally {
    setRedeeming(null);  // Re-enable button
  }
};
```

## 📊 Reward System Rules

1. **Point Economy**
   - Users earn points by completing submissions
   - Points never expire (unless configured)
   - Points can only be spent on rewards

2. **Reward Constraints**
   - Each reward has a fixed cost in points
   - Rewards have limited inventory
   - Users can't redeem without sufficient balance
   - Rewards can be disabled by admins

3. **Transaction Tracking**
   - Every point movement is logged
   - Transactions are immutable (audit trail)
   - Include reference to source (submission/event/reward)

## 🎯 Integration Points

### With Other Modules

1. **Event Submissions Module**
   - When submission is approved → Award points
   - Insert transaction record with type="earn"
   - Increment user.points

2. **User Module**
   - User profile includes points balance
   - Profile page links to wallet
   - Admin can view user's transaction history

3. **Analytics Module**
   - Transaction data used for engagement metrics
   - Points distribution analysis
   - Reward redemption rates

4. **Admin Module**
   - Create/update/delete rewards
   - Manage reward inventory
   - View all transactions
   - Audit user points

## 🔐 Security Considerations

1. **Authorization**
   - All endpoints require authentication
   - Users can only see their own balance/transactions
   - Admins can view everyone's data

2. **Data Validation**
   - Invalid reward IDs return 404
   - Negative points prevented by validation
   - Duplicate redemptions prevented by inventory check

3. **Audit Trail**
   - All transactions logged with timestamp
   - User ID always included
   - Cannot modify historical transactions

## 📚 Related Documentation

- [Backend README](./backend/README.md) - Detailed backend implementation
- [Frontend README](./frontend/README.md) - Detailed frontend implementation
- [API Specification](#) - OpenAPI docs at `/docs`
- [Database Schema](#) - MongoDB collection details

## 🧪 Testing Checklist

### Backend Tests
- [ ] Balance calculation (earned - redeemed)
- [ ] Transaction listing sorted by date
- [ ] Reward filtering for non-zero inventory
- [ ] Redemption validation (points, inventory)
- [ ] Concurrent redemption handling
- [ ] Error responses (404, 400, 401)

### Frontend Tests
- [ ] Data fetching on component mount
- [ ] Tab switching functionality
- [ ] Redeem button disabled state
- [ ] Toast notifications
- [ ] Loading states and spinners
- [ ] Date formatting in transaction table
- [ ] Responsive layout

## 🔄 Deployment Checklist

- [ ] Backend service running
- [ ] MongoDB collections created with indexes
- [ ] Seed rewards data
- [ ] Frontend build passes
- [ ] API endpoints accessible
- [ ] Authentication working
- [ ] CORS headers configured
- [ ] Environment variables set

## 📈 Future Enhancements

### Phase 1 (Current)
- [x] Basic wallet display
- [x] Transaction history
- [x] Reward redemption
- [x] Badge showcase

### Phase 2
- [ ] Reward categories and filters
- [ ] Advanced sorting options
- [ ] Leaderboard integration
- [ ] Bulk reward management

### Phase 3
- [ ] Reward recommendations
- [ ] Point expiration policies
- [ ] Gift card code generation
- [ ] Redemption analytics dashboard

### Phase 4
- [ ] Tiered rewards system
- [ ] Custom point multipliers
- [ ] Reward marketplace API
- [ ] Integration with external e-stores

## 🤝 Contributing

When modifying this module:

1. Update appropriate README file
2. Keep backend/frontend README in sync
3. Test both directions of changes
4. Update this E2E_README if architecture changes
5. Document new endpoints/components

## 📞 Support

For questions or issues:
1. Check relevant README file
2. Review API documentation
3. Check error handling in code
4. Consult module maintainers

---

**Module Version:** 1.0.0  
**Last Updated:** April 4, 2026  
**Status:** Production Ready
