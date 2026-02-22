# DENIF E-commerce - Demo Documentation

## Overview

This is a **fully functional demo** of an e-commerce checkout and order management system for DENIF, a handmade shoes shop. The demo includes a complete checkout flow, order management, and mock payment processing - all running in the browser using localStorage.

## Features

### ✅ Implemented Features

1. **Product Catalog**
   - Browse handmade shoes
   - Filter by category
   - Filter by size
   - Search products
   - Add to cart functionality

2. **Shopping Cart**
   - Add/remove items
   - Update quantities
   - Real-time total calculation
   - Persistent storage (localStorage)
   - Free shipping threshold (€200+)

3. **Checkout Flow**
   - Multi-step checkout form
   - Real-time validation
   - Italian phone/email validation
   - Multiple payment methods (mock)
   - Order summary
   - Delivery estimate

4. **Payment Processing** (Mock)
   - Simulated payment delay (2-3 seconds)
   - 90% success rate for testing
   - Multiple payment methods:
     - Credit/Debit Card
     - PayPal
     - Bank Transfer

5. **Order Management**
   - Order confirmation page
   - Order details view
   - Order history
   - Status tracking
   - Transaction IDs

6. **User Experience**
   - Responsive design (mobile, tablet, desktop)
   - Loading states
   - Error handling
   - Success animations
   - Italian language UI

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone or navigate to the project
cd Denif

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:4322`

### First Time Setup

1. Open `http://localhost:4322` in your browser
2. Browse the catalog and add products to cart
3. Click "Procedi al Checkout" when ready
4. Fill in the checkout form with any data (it's a demo)
5. Select a payment method
6. Complete the order

## Demo Test Data

### Valid Test Inputs

For testing, use these sample inputs:

**Email:** `test@esempio.it` or `mario.rossi@gmail.com`

**Phone:** `3123456789` (must start with 3 and be 10 digits)

**CAP:** `00100` (Rome) or any 5-digit Italian postal code

**Address:** Any valid address format

**Payment:** Any method works (90% success rate)

### Test Scenarios

#### Scenario 1: Successful Order
1. Add any product to cart
2. Proceed to checkout
3. Fill form with valid data
4. Complete payment
5. **Expected:** Order confirmation page with order ID

#### Scenario 2: Payment Failure (10%)
1. Add product to cart
2. Complete checkout
3. **Expected:** Error message (retry to see success)

#### Scenario 3: Form Validation
1. Try submitting with invalid email/phone/CAP
2. **Expected:** Inline error messages

#### Scenario 4: Empty Cart
1. Visit `/checkout` with empty cart
2. **Expected:** Redirect to catalog with message

## Technical Details

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Astro + React)              │
├─────────────────────────────────────────────────────────┤
│  Pages:                                                 │
│  - checkout.astro         (Checkout page)               │
│  - ordine-confermato.astro (Order confirmation)         │
│  - ordini.astro            (Order history)              │
│                                                          │
│  Components:                                            │
│  - CheckoutForm.tsx        (Checkout form)              │
│  - OrderSummary.tsx        (Order summary)              │
│  - PaymentMethodSelector.tsx (Payment selection)        │
├─────────────────────────────────────────────────────────┤
│                     Business Logic                       │
├─────────────────────────────────────────────────────────┤
│  lib/mock-payment.ts      (Simulated payment)           │
│  lib/order-storage.ts     (CRUD operations)             │
│  lib/validation.ts        (Form validators)             │
│  lib/types.ts             (TypeScript interfaces)       │
├─────────────────────────────────────────────────────────┤
│                      Data Layer                          │
├─────────────────────────────────────────────────────────┤
│  localStorage:                                           │
│  - denif-cart            (Shopping cart)                │
│  - denif-orders          (Order history)                │
│  - denif-products-cache  (Product cache)                │
└─────────────────────────────────────────────────────────┘
```

### Data Storage

All data is stored in browser localStorage:

```javascript
// Cart structure
{
  "denif-cart": [
    {
      "id": "1",
      "name": "Décolleté Classica in Pelle",
      "price": 280,
      "image": "...",
      "size": "38",
      "quantity": 1
    }
  ]
}

// Orders structure
{
  "denif-orders": {
    "orders": [
      {
        "orderId": "ORD-2024-000001",
        "customer": { ... },
        "items": [ ... ],
        "totals": { ... },
        "status": "confirmed",
        "createdAt": "2024-02-22T10:30:00Z"
      }
    ]
  }
}
```

### Mock Payment System

The payment system simulates real payment processing:

- **Delay:** 2-3 seconds (simulates network request)
- **Success Rate:** 90% (configurable in `mock-payment.ts`)
- **Transaction IDs:** Generated in format `CARD-{timestamp}-{random}`

### Limitations

⚠️ **Important:** This is a DEMO with the following limitations:

1. **No Real Payments**
   - Payment processing is simulated
   - No money is actually charged
   - No Stripe/PayPal integration

2. **No Server-Side Persistence**
   - All data stored in localStorage
   - Clearing browser data deletes orders
   - No backend/database

3. **No Real Emails**
   - Order confirmations are not sent
   - Only displayed on screen

4. **No Shipping Integration**
   - No real shipping calculation
   - No tracking numbers
   - No carrier integration

## File Structure

```
src/
├── components/
│   ├── Cart.tsx                    # Shopping cart (React)
│   ├── Cart.astro                  # Shopping cart (Astro)
│   ├── CheckoutForm.tsx            # Checkout form (NEW)
│   ├── OrderSummary.tsx            # Order summary (NEW)
│   ├── PaymentMethodSelector.tsx   # Payment selector (NEW)
│   ├── Header.astro                # Site header (MODIFIED)
│   └── Footer.astro                # Site footer (MODIFIED)
│
├── pages/
│   ├── checkout.astro              # Checkout page (NEW)
│   ├── ordine-confermato.astro     # Order confirmation (NEW)
│   └── ordini.astro                # Order history (NEW)
│
├── lib/
│   ├── types.ts                    # Type definitions (NEW)
│   ├── mock-payment.ts             # Mock payment (NEW)
│   ├── order-storage.ts            # Order CRUD (NEW)
│   ├── validation.ts               # Form validators (NEW)
│   └── airtable.ts                 # Product data (IMPROVED)
│
└── layouts/
    └── Layout.astro                # Main layout
```

## Testing Checklist

- [ ] Add product to cart
- [ ] Update cart quantity
- [ ] Remove item from cart
- [ ] View cart total calculation
- [ ] Proceed to checkout
- [ ] Fill checkout form with valid data
- [ ] Test form validation (invalid inputs)
- [ ] Select different payment methods
- [ ] Complete order successfully
- [ ] View order confirmation page
- [ ] Check order ID format
- [ ] View delivery estimate
- [ ] Navigate to order history
- [ ] View order details
- [ ] Test on mobile responsive
- [ ] Test empty cart redirect
- [ ] Test payment failure (retry until 10% hits)

## Troubleshooting

### Cart not loading
- Clear browser localStorage
- Refresh the page
- Check browser console for errors

### Checkout page shows empty cart
- Make sure items are in cart before visiting `/checkout`
- Check that `denif-cart` exists in localStorage

### Orders not appearing in history
- Ensure order was successfully completed
- Check `denif-orders` in browser DevTools → Application → Local Storage

### Payment always failing
- The mock has a 10% failure rate
- Try multiple times to see success
- Check console for error messages

## Development

### Adding New Features

1. **New Payment Method:**
   - Update `PaymentMethod` type in `lib/types.ts`
   - Add option in `CheckoutForm.tsx`
   - Update `mock-payment.ts` handler

2. **New Validation Rules:**
   - Add validator function in `lib/validation.ts`
   - Call in `CheckoutForm.tsx` `validateField`

3. **New Order Status:**
   - Update `OrderStatus` type in `lib/types.ts`
   - Update status badge rendering in pages

### Customization

**Change payment success rate:**
```typescript
// src/lib/mock-payment.ts
const isSuccess = Math.random() < 0.9; // Change 0.9 to desired rate
```

**Change free shipping threshold:**
```typescript
// In checkout page
const shipping = subtotal >= 200 ? 0 : 10; // Change 200
```

**Change delivery estimate:**
```typescript
// src/lib/order-storage.ts
const deliveryDays = 3 + Math.floor(Math.random() * 3); // 3-5 days
```

## Support

For issues or questions:
- Check the implementation docs: `IMPLEMENTATION.md`
- Review data flow: `DATA_FLOW.md`
- See testing guide: `TESTING_CHECKLIST.md`

## License

Demo project for DENIF e-commerce.
