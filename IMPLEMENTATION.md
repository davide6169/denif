# Implementation Details - DENIF E-commerce

## Architecture Overview

This document describes the technical implementation of the DENIF e-commerce demo, including architecture decisions, patterns used, and code organization.

## Technology Stack

### Frontend Framework
- **Astro** - Static site generator with partial hydration
- **React** - For interactive components (Cart, Forms)
- **TypeScript** - Type safety and better DX

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Neutral color palette** - Consistent with existing design
- **Font pairing** - Cormorant Garamond (headings), Inter (body)

### Data Storage
- **localStorage API** - Client-side persistence
- **No backend** - Fully frontend demo

### Icons
- **SVG icons** - Inline SVG for performance
- **Heroicons style** - Consistent icon set

## File Structure

```
src/
├── components/           # Reusable components
│   ├── Cart.tsx         # React cart component
│   ├── Cart.astro       # Astro cart component
│   ├── CheckoutForm.tsx # Checkout form with validation
│   ├── OrderSummary.tsx # Order totals and items
│   ├── PaymentMethodSelector.tsx # Payment selection
│   ├── Header.astro     # Site navigation
│   └── Footer.astro     # Site footer
│
├── pages/               # Route pages
│   ├── index.astro      # Homepage (existing)
│   ├── catalogo.astro   # Product catalog (existing)
│   ├── chi-sono.astro   # About page (existing)
│   ├── checkout.astro   # NEW: Checkout page
│   ├── ordine-confermato.astro # NEW: Order confirmation
│   └── ordini.astro     # NEW: Order history
│
├── lib/                 # Business logic
│   ├── types.ts         # TypeScript interfaces
│   ├── mock-payment.ts  # Payment simulation
│   ├── order-storage.ts # CRUD operations
│   ├── validation.ts    # Form validators
│   └── airtable.ts      # Product data source
│
└── layouts/             # Page layouts
    └── Layout.astro     # Main layout wrapper
```

## Component Design

### 1. CheckoutForm Component

**Purpose:** Collect customer information and handle form submission.

**Key Features:**
- Real-time validation
- Italian phone/email/CAP validation
- Payment method selection
- XSS prevention via sanitization
- Accessible form controls

**State Management:**
```typescript
const [formData, setFormData] = useState<CustomerInfo>({...});
const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
const [errors, setErrors] = useState<FormErrors>({});
const [touched, setTouched] = useState<Set<string>>(new Set());
```

**Validation Flow:**
1. User types → `handleChange` sanitizes input
2. Field blurred → `handleBlur` validates field
3. Form submitted → All fields validated
4. Errors displayed inline if invalid

**Props Interface:**
```typescript
interface CheckoutFormProps {
  onSubmit: (customer: CustomerInfo, paymentMethod: PaymentMethod) => void;
  isLoading: boolean;
}
```

### 2. OrderSummary Component

**Purpose:** Display order totals and items during checkout.

**Key Features:**
- Real-time total calculation
- Free shipping badge
- Delivery estimate display
- Secure checkout messaging

**Props Interface:**
```typescript
interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}
```

### 3. PaymentMethodSelector Component

**Purpose:** Allow users to select payment method.

**Key Features:**
- Visual selection with icons
- Disabled state support
- Radio button behavior
- Hover effects

**Options:**
- Credit/Debit Card
- PayPal
- Bank Transfer

## Page Implementation

### Checkout Page (`checkout.astro`)

**Route:** `/checkout`

**Responsibilities:**
1. Load cart from localStorage
2. Redirect if cart empty
3. Render form and summary
4. Handle form submission
5. Process mock payment
6. Create and save order
7. Redirect to confirmation

**Flow Diagram:**
```
┌─────────────────────────────────────────────────────────────┐
│  User visits /checkout                                      │
└─────────────┬───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│  Check localStorage for cart                                │
│  ┌──────────────┐    ┌──────────────┐                     │
│  │ Cart exists? │──NO→│ Redirect to  │                     │
│  │              │    │ /catalogo    │                     │
│  └──────┬───────┘    └──────────────┘                     │
│         │YES                                                   │
│         ▼                                                      │
│  ┌──────────────────────────────────────────────┐            │
│  │ Render CheckoutForm + OrderSummary           │            │
│  └──────────────────┬───────────────────────────┘            │
│                     │                                          │
│                     ▼                                          │
│  ┌──────────────────────────────────────────────┐            │
│  │ User submits form                            │            │
│  └──────────────────┬───────────────────────────┘            │
│                     │                                          │
│                     ▼                                          │
│  ┌──────────────────────────────────────────────┐            │
│  │ Validate form data                           │            │
│  ┌──────────────┐    ┌──────────────┐                     │
│  │ Valid?       │──NO→│ Show errors  │                     │
│  │              │    │ inline       │                     │
│  └──────┬───────┘    └──────────────┘                     │
│         │YES                                                   │
│         ▼                                                      │
│  ┌──────────────────────────────────────────────┐            │
│  │ Process payment (2-3 sec delay)              │            │
│  ┌──────────────┐    ┌──────────────┐                     │
│  │ Success?     │──NO→│ Show error   │                     │
│  │              │    │ message      │                     │
│  └──────┬───────┘    └──────────────┘                     │
│         │YES                                                   │
│         ▼                                                      │
│  ┌──────────────────────────────────────────────┐            │
│  │ Create order object                          │            │
│  │ - Generate order ID                          │            │
│  │ - Calculate totals                           │            │
│  │ - Set status to "confirmed"                  │            │
│  └──────────────────┬───────────────────────────┘            │
│                     │                                          │
│                     ▼                                          │
│  ┌──────────────────────────────────────────────┐            │
│  │ Save order to localStorage                   │            │
│  └──────────────────┬───────────────────────────┘            │
│                     │                                          │
│                     ▼                                          │
│  ┌──────────────────────────────────────────────┐            │
│  │ Clear cart                                   │            │
│  └──────────────────┬───────────────────────────┘            │
│                     │                                          │
│                     ▼                                          │
│  ┌──────────────────────────────────────────────┐            │
│  │ Redirect to /ordine-confermato?orderId=XXX   │            │
│  └──────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

### Order Confirmation Page (`ordine-confermato.astro`)

**Route:** `/ordine-confermato?orderId={orderId}`

**Responsibilities:**
1. Parse orderId from URL
2. Load order from localStorage
3. Display order details
4. Show success animation
5. Provide next steps

**Key Sections:**
- Success animation with checkmark
- Order ID and date
- Customer information
- Order items with images
- Order totals
- Payment information
- Delivery estimate
- Action buttons (continue shopping, view orders)

### Order History Page (`ordini.astro`)

**Route:** `/ordini`

**Responsibilities:**
1. Load all orders from localStorage
2. Display order cards
3. Show order status badges
4. Handle order detail modal

**Features:**
- Click order card to view details
- Modal with full order information
- Status badges with colors
- Filter/sort (future enhancement)

## Business Logic

### Mock Payment System (`lib/mock-payment.ts`)

**Function:** `processPayment(amount, method)`

**Process:**
1. Simulate network delay (2-3 seconds)
2. Determine success/failure (90% success)
3. Generate transaction ID if success
4. Return result object

**Transaction ID Format:**
```
CARD-{timestamp}-{random}    // For card payments
PAYPAL-{timestamp}-{random}  // For PayPal
BANK-{timestamp}-{random}    // For bank transfer
```

**Error Handling:**
- Returns specific error messages per payment method
- Supports retry logic

### Order Storage (`lib/order-storage.ts`)

**Functions:**

| Function | Purpose |
|----------|---------|
| `getOrders()` | Get all orders from localStorage |
| `getOrderById(id)` | Get single order by ID |
| `saveOrder(order)` | Save new order |
| `updateOrderStatus(id, status)` | Update order status |
| `deleteOrder(id)` | Delete order (admin) |
| `clearCart()` | Clear cart after order |
| `generateOrderId()` | Generate unique order ID |
| `calculateEstimatedDelivery()` | Calculate delivery date |

**Order ID Format:**
```
ORD-YYYY-{timestamp}{random}
Example: ORD-2024-17082345AB
```

### Validation System (`lib/validation.ts`)

**Validators:**

| Validator | Purpose | Rules |
|-----------|---------|-------|
| `validateEmail()` | Email validation | Italian domain, valid format |
| `validatePhone()` | Phone validation | Starts with 3, 10-12 digits |
| `validatePostalCode()` | CAP validation | 5 digits, valid Italian range |
| `validateName()` | Name validation | 2-50 chars, letters only |
| `validateAddress()` | Address validation | 5-100 chars |
| `validateCity()` | City validation | 2+ chars |
| `validateCountry()` | Country validation | Required field |
| `validateCustomerInfo()` | Full validation | Validates all fields |

**Sanitization:**
All inputs are sanitized via `sanitizeInput()` to prevent XSS:
```typescript
function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
```

## Type System

### Core Types (`lib/types.ts`)

```typescript
// Cart Item
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

// Customer Information
interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes?: string;
}

// Order
interface Order {
  orderId: string;
  customer: CustomerInfo;
  items: OrderItem[];
  payment: PaymentInfo;
  totals: OrderTotals;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery?: string;
}

// Order Status
type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

// Payment Method
type PaymentMethod = 'card' | 'paypal' | 'bank-transfer';
```

## State Management

### Client-Side State

State is managed through:

1. **React useState** - Component-level state
   - Form data
   - Validation errors
   - Loading states

2. **localStorage** - Persistent state
   - Cart items
   - Orders
   - Product cache

3. **URL Params** - Navigation state
   - Order ID for confirmation page

### No Global State Management

The demo doesn't use Redux/Zustand as it's not needed for this scope. React's built-in state management is sufficient.

## Performance Considerations

### Optimization Strategies

1. **Code Splitting**
   - Astro automatically code-splits by page
   - React components loaded only when needed

2. **localStorage Caching**
   - Products cached for 24 hours
   - Reduces API calls (even if mock)

3. **Lazy Loading**
   - Order details loaded on demand
   - Modal content rendered only when open

4. **Image Optimization**
   - Using Unsplash with size parameters
   - In production, would use Astro's image optimization

### Bundle Size

Approximate sizes (minified):
- CheckoutForm.tsx: ~8KB
- OrderSummary.tsx: ~2KB
- PaymentMethodSelector.tsx: ~2KB
- Total added: ~12KB + dependencies

## Security Considerations

### XSS Prevention

1. **Input Sanitization**
   - All form inputs sanitized
   - React's built-in escaping

2. **localStorage Safety**
   - No sensitive data stored (real passwords, cards)
   - Only mock data

3. **No eval()**
   - No dynamic code execution
   - Template literals only with trusted data

### Limitations (Demo Only)

⚠️ **This is a demo - NOT production-ready:**
- No real payment processing
- No server-side validation
- No CSRF protection
- No rate limiting
- No authentication

## Responsive Design

### Breakpoints

Following Tailwind's defaults:
- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (wide desktop)

### Mobile Considerations

1. **Stacked Layout**
   - Form and summary stacked on mobile
   - Side-by-side on desktop (lg+)

2. **Touch-Friendly**
   - Minimum tap target 44px
   - Spacious form controls

3. **Readable Text**
   - Minimum 16px body text
   - Proper contrast ratios

## Accessibility

### ARIA Labels

All interactive elements have proper ARIA labels:
- Cart buttons: `aria-label="Carrello"`
- Close buttons: `aria-label="Chiudi"`
- Form inputs: associated with `<label>`

### Keyboard Navigation

- Full keyboard navigation support
- Focus management in modals
- Escape to close modals

### Screen Readers

- Semantic HTML
- Proper heading hierarchy
- Status announcements (loading, errors)

## Error Handling

### Client-Side Errors

1. **Form Validation Errors**
   - Displayed inline below fields
   - Red border + text message

2. **Payment Errors**
   - Displayed in error banner
   - Retry button available

3. **Cart Empty**
   - Friendly message
   - CTA to browse catalog

### Error Messages

All error messages in Italian for consistency:
```
"Carta rifiutata dalla banca"
"Fondi insufficienti"
"Email non valida"
"Telefono non valido"
```

## Testing Strategy

### Manual Testing Checklist

See `TESTING_CHECKLIST.md` for comprehensive test cases.

### Key Test Areas

1. **Form Validation**
   - Required fields
   - Format validation
   - Error messages

2. **Payment Flow**
   - Success path (90%)
   - Failure path (10%)
   - Transaction ID generation

3. **Order Creation**
   - Order saved to localStorage
   - Cart cleared after order
   - Order ID format correct

4. **Navigation**
   - Empty cart redirect
   - Success redirect
   - Back button handling

## Future Enhancements

### Potential Improvements

1. **Backend Integration**
   - Real payment processing (Stripe)
   - Database persistence
   - Email notifications

2. **User Accounts**
   - Login/registration
   - Order history per user
   - Saved addresses

3. **Advanced Features**
   - Guest checkout
   - Multiple shipping addresses
   - Gift cards/coupons
   - Product reviews

4. **Admin Panel**
   - Order management
   - Inventory tracking
   - Analytics dashboard

5. **Performance**
   - Image optimization
   - Code splitting improvements
   - Service Worker for offline

## Maintenance

### Code Style

- TypeScript strict mode enabled
- Prettier for formatting
- ESLint for linting

### Documentation

- All functions have JSDoc comments
- Complex logic explained inline
- Type definitions self-documenting

### Git Workflow

Recommended branch strategy:
- `main` - Production
- `develop` - Development
- `feature/*` - New features
- `fix/*` - Bug fixes
