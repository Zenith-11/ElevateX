# Module Integration Guide - Wallet & Redemption

## Overview
This guide explains how the wallet and redemption module in `modules/wallet-redemption/` relates to the main project and how to integrate it.

## Module Structure

```
ElevateX/
├── backend/                    ← Main backend (do not modify for this module)
├── frontend/                   ← Main frontend (do not modify for this module)
└── modules/
    └── wallet-redemption/      ← Your new organized module
        ├── backend/            ← Copy these files to backend/
        ├── frontend/           ← Copy these files to frontend/
        └── E2E_README.md       ← Complete documentation
```

## Integration Steps

### Step 1: Backend Integration

The backend files in `modules/wallet-redemption/backend/` correspond to:

| Module File | Main Project Location |
|------------|----------------------|
| `backend/models/wallet.py` | `backend/models/wallet.py` |
| `backend/routers/wallet.py` | `backend/routers/wallet.py` |
| `backend/services/wallet_service.py` | `backend/services/wallet_service.py` |

**These files are already in the main project.**

To register the router in `backend/main.py`:
```python
from routers.wallet import router as wallet_router

app.include_router(wallet_router)
```

### Step 2: Frontend Integration

The frontend files in `modules/wallet-redemption/frontend/` correspond to:

| Module File | Main Project Location |
|------------|----------------------|
| `frontend/pages/Wallet.jsx` | `frontend/src/pages/Wallet.jsx` |
| `frontend/pages/Wallet.css` | `frontend/src/pages/Wallet.css` |
| `frontend/api/walletAPI.js` | `frontend/src/api/walletAPI.js` |

**These files are already in the main project.**

To add the route in your React Router:
```javascript
import Wallet from "./pages/Wallet";

<Route path="/wallet" element={<Wallet />} />
```

### Step 3: Update Navigation

Add wallet link to navbar/sidebar:
```javascript
{ label: "Wallet", icon: "account_balance_wallet", path: "/wallet" }
```

## Module Purposes

### Development & Documentation
- **Keep module files updated** with your working code
- **Reference material** for understanding the module
- **Clean separation** for future team members

### Scaling
When creating new modules (future):
- Follow the same structure
- Keep backend/frontend/E2E_README in sync
- Create dedicated folder for each module

## File Cross-Reference

### Main Project → Module
If you modify files in the main project:
1. Update corresponding files in `modules/wallet-redemption/`
2. Keep documentation in sync
3. This creates a single source of truth

### Module → Main Project
If you're setting up a new environment:
1. Copy files from `modules/wallet-redemption/backend/` to `backend/`
2. Copy files from `modules/wallet-redemption/frontend/src/` to `frontend/src/`
3. Follow integration steps above

## API Endpoints

All wallet endpoints are prefixed with `/api/wallet`:

```
GET  /api/wallet/balance           - Get user's wallet balance
GET  /api/wallet/transactions      - Get transaction history
GET  /api/wallet/rewards           - Get available rewards
POST /api/wallet/redeem            - Redeem a reward
```

## Database Collections Required

Ensure these MongoDB collections exist:

1. **users**
   - Field: `points` (Number)
   - Field: `badges` (Array)

2. **transactions**
   - Required fields: `user_id`, `type`, `amount`, `description`, `timestamp`

3. **rewards**
   - Required fields: `name`, `description`, `cost_points`, `category`, `inventory`

## Testing the Module

### Backend Tests
```bash
# Test wallet endpoints
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/wallet/balance
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/wallet/transactions
```

### Frontend Tests
1. Navigate to `/wallet` route
2. Verify balance loads
3. Check transaction history
4. Attempt to redeem a reward

## Troubleshooting

### Imports Not Resolving
- Ensure module files are properly placed in backend/frontend directories
- Check relative import paths in walletAPI.js

### API Errors
- Verify wallet router is registered in main.py
- Check MongoDB collections exist
- Ensure user is authenticated (valid JWT token)

### UI Not Displaying
- Verify route is added to React Router
- Check console for import errors
- Ensure Navbar and Sidebar components exist

## Next Steps

1. **Verify Integration**: Test all endpoints and UI
2. **Customize**: Adjust rewards, badges, point values as needed
3. **Documentation**: Keep E2E_README updated with any changes
4. **Scaling**: Use this as template for other modules

## Module Maintenance

When modifying this module:

1. Update working files in `backend/` and `frontend/src/`
2. Copy updates to `modules/wallet-redemption/`
3. Update relevant README files
4. Test both locations work identically

## Future Module Expansion

To add features to this module:

1. Create new files in the appropriate `backend/` or `frontend/` subdirectory
2. Update the README files
3. Add to E2E_README.md
4. Update the integration guide

---

**Note**: This modular structure helps maintain clean organization and provides excellent documentation for future developers or team expansion.
