# Wallet & Redemption Module - Frontend

## Overview
The Wallet & Redemption frontend module provides a comprehensive user interface for managing digital points, viewing transaction history, earning badges, and redeeming rewards.

## Features
- **Digital Wallet Dashboard**: Display user points balance with visual representation
- **Points Analytics**: Shows earned vs redeemed points with transaction count
- **Badge Showcase**: Display all earned achievement badges
- **Transaction History**: Detailed log of all point transactions
- **Reward Marketplace**: Browse and redeem available rewards
- **Real-time Updates**: Instant balance updates after redemptions
- **Toast Notifications**: User feedback for actions

## Project Structure

```
frontend/
├── pages/
│   ├── Wallet.jsx              # Main wallet component
│   └── Wallet.css              # Component styles
├── api/
│   └── walletAPI.js            # API integration layer
├── components/                 # Reusable wallet components (future)
└── README.md
```

## Components

### Wallet.jsx
Main component that orchestrates the entire wallet interface.

**Key Features:**
- Balance display with gradient styling
- Badge grid with custom colors per badge type
- Tab-based navigation (Transactions / Rewards)
- Transaction table with formatting
- Reward cards with redemption buttons
- Toast notifications for user feedback

**Props:** None (uses context/storage for auth)

**State:**
```javascript
{
  balance: { total_points, earned_points, redeemed_points, badges, transaction_count },
  transactions: Array<Transaction>,
  rewards: Array<Reward>,
  loading: Boolean,
  redeeming: String | null,        // Currently redeeming reward ID
  toast: { msg: String, type: String },
  activeTab: "transactions" | "rewards"
}
```

## API Integration

### walletAPI.js

Centralized module for all wallet-related API calls.

```javascript
walletAPI.balance()           // GET /api/wallet/balance
walletAPI.transactions()      // GET /api/wallet/transactions
walletAPI.rewards()           // GET /api/wallet/rewards
walletAPI.redeem(reward_id)   // POST /api/wallet/redeem
```

## Styling

The module uses CSS custom properties for theming:

```css
--gradient-card      /* Card background gradient */
--gradient-gold      /* Gold text gradient for points */
--primary           /* Primary action color */
--primary-light     /* Light primary variant */
--text-primary      /* Main text color */
--text-muted        /* Secondary text color */
--border            /* Border color */
--space-*           /* Spacing scale */
--radius-md         /* Border radius */
--transition-fast   /* Animation duration */
```

## Badge System

Predefined badges with custom icons and colors:

| Badge | Icon | Color |
|-------|------|-------|
| First Steps | flag | #6C3FE6 |
| Getting Started | rocket_launch | #00D4AA |
| Achiever | star | #FFB800 |
| Champion | emoji_events | #FF6B6B |
| Point Hunter | monetization_on | #6C3FE6 |
| High Scorer | diamond | #00D4AA |
| Elite | crown | #FFB800 |

## Data Flow

```
Component Mount
    ↓
fetchData() - Fetch balance, transactions, rewards
    ↓
setState with data
    ↓
Render UI with tabs
    ↓
User interacts (tab change, redeem)
    ↓
Handle action (e.g., handleRedeem)
    ↓
API call
    ↓
fetchData() - Refresh all data
    ↓
Show toast notification
    ↓
Re-render with updated state
```

## User Interactions

### View Balance
- Automatically fetched on component mount
- Displays total, earned, and redeemed points
- Shows transaction count

### View Badges
- Scrollable grid of earned badges
- Hover to see badge name
- Custom colored icon for each badge

### View Transactions
- Tab-based view
- Table format with description, type, amount, date
- Color-coded type badges (green for earn, orange for redeem)
- Formatted timestamps

### Redeem Reward
- Disabled if user has insufficient points
- Shows loading spinner during redemption
- Success/error toast notification
- Automatic balance refresh after redemption
- Shows remaining inventory

## Error Handling

```javascript
try {
  await walletAPI.redeem(rewardId);
  showToast(`Redeemed "${name}" successfully!`);
} catch(e) {
  showToast(e.response?.data?.detail || "Redemption failed", "error");
}
```

## Responsive Design

- **Desktop (>800px)**: 2-column layout for balance card
- **Tablet/Mobile (<800px)**: Single-column layout
- Rewards grid adapts with `minmax(240px, 1fr)`

## Performance Optimizations

- Single data fetch on mount with `Promise.all()`
- Selective state updates
- Conditional rendering for empty states
- Lazy loading indicators with spinner

## Dependencies

- `react`: UI framework
- `axios`: HTTP client (via global api)
- `date-fns`: Date formatting
- `material-icons`: Icon library

## Integration with Main App

1. Add to router in main app
2. Import Wallet component
3. Ensure auth context provides token
4. Use within authenticated layout

```javascript
import Wallet from './pages/Wallet';

// In Router
<Route path="/wallet" element={<Wallet />} />
```

## Future Enhancements

- [ ] Reward filters and search
- [ ] Sorting options for transactions
- [ ] Estimated redemption delivery date
- [ ] Reward recommendations
- [ ] Transaction export (CSV/PDF)
- [ ] Points expiration warnings
- [ ] Reward rating/review system
- [ ] Gift card code display/sharing
- [ ] Wishlist feature
- [ ] Connected accounts for rewards
