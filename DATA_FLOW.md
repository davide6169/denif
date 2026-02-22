# Data Flow Documentation - DENIF E-commerce

## Overview

This document describes how data flows through the DENIF e-commerce demo, from product browsing to order completion and storage.

## Data Flow Diagram

### Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          USER JOURNEY                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. BROWSE CATALOG                                                      │
│  ┌──────────┐    ┌───────────┐    ┌──────────┐                         │
│  │ Products │───▶│ Add Item  │───▶│ Cart UI  │                         │
│  └──────────┘    └───────────┘    └────┬─────┘                         │
│                                       │                                  │
│                                       ▼                                  │
│  2. SHOPPING CART STATE                                                  │
│  ┌────────────────────────────────────────────────────┐                │
│  │ localStorage: denif-cart                            │                │
│  │ [{                                                  │                │
│  │   id: "1",                                         │                │
│  │   name: "Décolleté Classica",                      │                │
│  │   price: 280,                                      │                │
│  │   quantity: 1,                                     │                │
│  │   size: "38"                                       │                │
│  │ }]                                                 │                │
│  └────────────────────┬───────────────────────────────┘                │
│                       │                                                  │
│                       ▼                                                  │
│  3. CHECKOUT FLOW                                                         │
│  ┌──────────────┐    ┌───────────────┐    ┌──────────────┐            │
│  │ Form Input   │───▶│ Validation    │───▶│ Payment      │            │
│  │ (Customer)   │    │ (Italian)     │    │ (Mock 2-3s)  │            │
│  └──────────────┘    └───────────────┘    └──────┬───────┘            │
│                                                  │                      │
│                                                  ▼                      │
│  4. ORDER CREATION                                                       │
│  ┌────────────────────────────────────────────────────────┐           │
│  │ 1. Generate Order ID: ORD-2024-17082345AB             │           │
│  │ 2. Create Order Object                                │           │
│  │ 3. Calculate Totals (subtotal, shipping, total)       │           │
│  │ 4. Set Status: "confirmed"                            │           │
│  │ 5. Calculate Delivery Date (+3-5 days)                │           │
│  └────────────────────────┬───────────────────────────────┘           │
│                           │                                              │
│                           ▼                                              │
│  5. PERSISTENCE                                                           │
│  ┌────────────────────────────────────────────────────────┐           │
│  │ localStorage: denif-orders                             │           │
│  │ {                                                      │           │
│  │   orders: [{                                           │           │
│  │     orderId: "ORD-2024-17082345AB",                   │           │
│  │     customer: {...},                                  │           │
│  │     items: [...],                                     │           │
│  │     totals: {...},                                    │           │
│  │     status: "confirmed",                              │           │
│  │     createdAt: "2024-02-22T10:30:00Z"                 │           │
│  │   }]                                                  │           │
│  │ }                                                      │           │
│  └────────────────────────┬───────────────────────────────┘           │
│                           │                                              │
│                           ▼                                              │
│  6. CART CLEAR & REDIRECT                                                  │
│  ┌───────────────┐              ┌──────────────────────┐              │
│  │ Clear Cart    │─────────────▶│ Redirect to          │              │
│  │ (localStorage)│              │ /ordine-confermato   │              │
│  └───────────────┘              └──────────────────────┘              │
│                                                                         │
│  7. ORDER CONFIRMATION                                                    │
│  ┌────────────────────────────────────────────────────────┐           │
│  │ Display:                                               │           │
│  │ - Order ID                                             │           │
│  │ - Customer Info                                        │           │
│  │ - Order Items                                          │           │
│  │ - Totals                                               │           │
│  │ - Delivery Estimate                                    │           │
│  │ - Transaction ID                                       │           │
│  └────────────────────────────────────────────────────────┘           │
│                                                                         │
│  8. ORDER HISTORY                                                        │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐         │
│  │ Visit /ordini│───▶│ Load Orders   │───▶│ Display List  │         │
│  └───────────────┘    └───────────────┘    └───────────────┘         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Structures

### 1. Cart Item

Stored in `localStorage: denif-cart`

```typescript
interface CartItem {
  id: string;              // Product ID: "1", "2", "3"
  name: string;            // Product name
  price: number;           // Unit price in EUR
  image: string;           // Image URL
  size: string;            // Selected size: "38"
  quantity: number;        // Quantity in cart
}
```

**Example:**
```json
{
  "denif-cart": [
    {
      "id": "1",
      "name": "Décolleté Classica in Pelle",
      "price": 280,
      "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80",
      "size": "38",
      "quantity": 2
    },
    {
      "id": "3",
      "name": "Mocassino in Pelle Scamosciata",
      "price": 320,
      "image": "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500&q=80",
      "size": "40",
      "quantity": 1
    }
  ]
}
```

### 2. Customer Info

Part of Order object

```typescript
interface CustomerInfo {
  firstName: string;      // "Mario"
  lastName: string;       // "Rossi"
  email: string;          // "mario.rossi@email.it"
  phone: string;          // "3123456789"
  address: string;        // "Via Roma 123"
  city: string;           // "Roma"
  postalCode: string;     // "00100"
  country: string;        // "Italia"
  notes?: string;         // Optional delivery notes
}
```

### 3. Order Item

Stored within Order object

```typescript
interface OrderItem {
  id: string;             // Product ID
  name: string;           // Product name
  price: number;          // Unit price
  image: string;          // Image URL
  size: string;           // Selected size
  quantity: number;       // Quantity ordered
  subtotal: number;       // price * quantity
}
```

### 4. Order

Stored in `localStorage: denif-orders`

```typescript
interface Order {
  orderId: string;        // Format: ORD-2024-17082345AB
  customer: CustomerInfo;
  items: OrderItem[];
  payment: PaymentInfo;
  totals: OrderTotals;
  status: OrderStatus;
  createdAt: string;      // ISO timestamp
  estimatedDelivery?: string; // ISO timestamp
}
```

**Full Example:**
```json
{
  "denif-orders": {
    "orders": [
      {
        "orderId": "ORD-2024-17082345AB",
        "customer": {
          "firstName": "Mario",
          "lastName": "Rossi",
          "email": "mario.rossi@email.it",
          "phone": "3123456789",
          "address": "Via Roma 123",
          "city": "Roma",
          "postalCode": "00100",
          "country": "Italia"
        },
        "items": [
          {
            "id": "1",
            "name": "Décolleté Classica in Pelle",
            "price": 280,
            "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80",
            "size": "38",
            "quantity": 2,
            "subtotal": 560
          }
        ],
        "payment": {
          "method": "card",
          "transactionId": "CARD-1708234567890-AB12CD",
          "status": "completed"
        },
        "totals": {
          "subtotal": 560,
          "shipping": 0,
          "total": 560
        },
        "status": "confirmed",
        "createdAt": "2024-02-22T10:30:00Z",
        "estimatedDelivery": "2024-02-27T10:30:00Z"
      }
    ]
  }
}
```

## Component Data Flow

### Cart Component

```
┌─────────────────────────────────────────────────────────────┐
│  Cart Component (Cart.tsx / Cart.astro)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  MOUNT                                                      │
│  ┌─────────────────────────────────────────────┐           │
│  │ useEffect(() => loadCart(), [])            │           │
│  └──────────────┬──────────────────────────────┘           │
│                 │                                           │
│                 ▼                                           │
│  ┌─────────────────────────────────────────────┐           │
│  │ localStorage.getItem('denif-cart')          │           │
│  │ JSON.parse(stored)                          │           │
│  │ setCart(cart)                               │           │
│  └─────────────────────────────────────────────┘           │
│                                                             │
│  ADD ITEM                                                   │
│  ┌─────────────────────────────────────────────┐           │
│  │ addToCart(item)                             │           │
│  │ 1. Check if item exists (id + size)        │           │
│  │ 2. If yes: increment quantity              │           │
│  │ 3. If no: push to cart with quantity: 1    │           │
│  │ 4. saveCart(newCart)                       │           │
│  │ 5. updateCartUI()                          │           │
│  └─────────────────────────────────────────────┘           │
│                                                             │
│  UPDATE QUANTITY                                            │
│  ┌─────────────────────────────────────────────┐           │
│  │ updateQuantity(index, delta)                │           │
│  │ 1. cart[index].quantity += delta           │           │
│  │ 2. If quantity <= 0: remove item           │           │
│  │ 3. saveCart(newCart)                       │           │
│  │ 4. updateCartUI()                          │           │
│  └─────────────────────────────────────────────┘           │
│                                                             │
│  UPDATE UI                                                  │
│  ┌─────────────────────────────────────────────┐           │
│  │ updateCartUI()                              │           │
│  │ 1. Render cart items                        │           │
│  │ 2. Calculate total                          │           │
│  │ 3. Update cart count badges                 │           │
│  │ 4. Show/hide cart footer                    │           │
│  └─────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Checkout Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Checkout Page (checkout.astro)                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PAGE LOAD                                                  │
│  ┌─────────────────────────────────────────────┐           │
│  │ 1. Get cart from localStorage               │           │
│  │ 2. If empty: redirect to /catalogo          │           │
│  │ 3. If items: render form + summary          │           │
│  └─────────────────────────────────────────────┘           │
│                                                             │
│  FORM SUBMIT                                                │
│  ┌─────────────────────────────────────────────┐           │
│  │ handleCheckout(customer, paymentMethod)     │           │
│  │                                             │           │
│  │ ┌───────────────────────────────────┐      │           │
│  │ │ 1. VALIDATE                       │      │           │
│  │ │    - Check all required fields    │      │           │
│  │ │    - Run validators               │      │           │
│  │ │    - Show errors if invalid       │      │           │
│  │ └────────────┬──────────────────────┘      │           │
│  │              │ valid?                       │           │
│  │              ▼                              │           │
│  │ ┌───────────────────────────────────┐      │           │
│  │ │ 2. CALCULATE TOTALS               │      │           │
│  │ │    - subtotal = sum(items)        │      │           │
│  │ │    - shipping = (subtotal >= 200) │      │           │
│  │ │      ? 0 : 10                     │      │           │
│  │ │    - total = subtotal + shipping  │      │           │
│  │ └────────────┬──────────────────────┘      │           │
│  │              │                              │           │
│  │              ▼                              │           │
│  │ ┌───────────────────────────────────┐      │           │
│  │ │ 3. PROCESS PAYMENT                │      │           │
│  │ │    - await processPayment()       │      │           │
│  │ │    - 2-3 second delay             │      │           │
│  │ │    - 90% success rate             │      │           │
│  │ └────────────┬──────────────────────┘      │           │
│  │              │ success?                     │           │
│  │              ▼                              │           │
│  │ ┌───────────────────────────────────┐      │           │
│  │ │ 4. CREATE ORDER                   │      │           │
│  │ │    - orderId = generateOrderId()  │      │           │
│  │ │    - order = { ...all data }      │      │           │
│  │ │    - status = "confirmed"         │      │           │
│  │ │    - delivery = calculateDate()   │      │           │
│  │ └────────────┬──────────────────────┘      │           │
│  │              │                              │           │
│  │              ▼                              │           │
│  │ ┌───────────────────────────────────┐      │           │
│  │ │ 5. SAVE ORDER                     │      │           │
│  │ │    - saveOrder(order)             │      │           │
│  │ │    - localStorage: denif-orders   │      │           │
│  │ └────────────┬──────────────────────┘      │           │
│  │              │                              │           │
│  │              ▼                              │           │
│  │ ┌───────────────────────────────────┐      │           │
│  │ │ 6. CLEAR CART                     │      │           │
│  │ │    - clearCart()                  │      │           │
│  │ │    - removeItem('denif-cart')     │      │           │
│  │ └────────────┬──────────────────────┘      │           │
│  │              │                              │           │
│  │              ▼                              │           │
│  │ ┌───────────────────────────────────┐      │           │
│  │ │ 7. REDIRECT                       │      │           │
│  │ │    - location.href =              │      │           │
│  │ │      /ordine-confermato?          │      │           │
│  │ │      orderId={orderId}            │      │           │
│  │ └───────────────────────────────────┘      │           │
│  └─────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Order Confirmation

```
┌─────────────────────────────────────────────────────────────┐
│  Order Confirmation (ordine-confermato.astro)              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PAGE LOAD                                                  │
│  ┌─────────────────────────────────────────────┐           │
│  │ 1. Get orderId from URL params              │           │
│  │    const params = new URLSearchParams()     │           │
│  │    const orderId = params.get('orderId')    │           │
│  │                                             │           │
│  │ 2. Load order from storage                  │           │
│  │    const order = getOrderById(orderId)      │           │
│  │                                             │           │
│  │ 3. If not found: show error                 │           │
│  │                                             │           │
│  │ 4. If found: display order                  │           │
│  │    - Order ID + Date                        │           │
│  │    - Customer information                   │           │
│  │    - Order items with images                │           │
│  │    - Totals breakdown                       │           │
│  │    - Delivery estimate                      │           │
│  │    - Payment info + transaction ID          │           │
│  └─────────────────────────────────────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Order History

```
┌─────────────────────────────────────────────────────────────┐
│  Order History (ordini.astro)                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PAGE LOAD                                                  │
│  ┌─────────────────────────────────────────────┐           │
│  │ 1. Load all orders                          │           │
│  │    const orders = getOrders()               │           │
│  │                                             │           │
│  │ 2. If no orders: show empty state            │           │
│  │                                             │           │
│  │ 3. If orders exist: render list             │           │
│  │    For each order:                          │           │
│  │    - Order card with summary                │           │
│  │    - Status badge                           │           │
│  │    - Total amount                           │           │
│  │    - "View Details" button                  │           │
│  └─────────────────────────────────────────────┘           │
│                                                             │
│  VIEW DETAILS                                               │
│  ┌─────────────────────────────────────────────┐           │
│  │ 1. User clicks order card                   │           │
│  │                                             │           │
│  │ 2. Get order by ID                          │           │
│  │    const order = getOrderById(orderId)      │           │
│  │                                             │           │
│  │ 3. Open modal with details                  │           │
│  │    - Full order information                 │           │
│  │    - All items with quantities             │           │
│  │    - Complete totals breakdown              │           │
│  │    - Delivery estimate if applicable        │           │
│  └─────────────────────────────────────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## localStorage Schema

### Storage Keys

| Key | Type | Purpose |
|-----|------|---------|
| `denif-cart` | Array<CartItem> | Shopping cart contents |
| `denif-orders` | OrderStorage | All customer orders |
| `denif-products-cache` | ProductCache | Cached product data |

### Storage Access Patterns

```javascript
// READ
const cart = JSON.parse(localStorage.getItem('denif-cart') || '[]');
const orders = JSON.parse(localStorage.getItem('denif-orders') || '{"orders":[]}');

// WRITE
localStorage.setItem('denif-cart', JSON.stringify(newCart));
localStorage.setItem('denif-orders', JSON.stringify({ orders: newOrders }));

// DELETE
localStorage.removeItem('denif-cart');
```

### Data Lifecycle

```
CART                    ORDERS
│                      │
│ 1. Add item          │ 1. Order created
│ 2. Update quantity   │ 2. Never auto-deleted
│ 3. Remove item       │ 3. Persists until:
│ 4. Cleared on order  │    - Browser data cleared
│                      │    - Manual deletion
└──────────────────────┴───────────────────────────
```

## State Transitions

### Order Status Flow

```
┌────────┐     ┌──────────┐     ┌───────────┐     ┌────────┐
│ PENDING│────▶│CONFIRMED │────▶│PROCESSING│────▶│SHIPPED │
└────────┘     └──────────┘     └───────────┘     └────────┘
                     │                                   │
                     │                                   ▼
                     │                            ┌─────────┐
                     │                            │DELIVERED│
                     │                            └─────────┘
                     ▼
              ┌──────────┐
              │CANCELLED │
              └──────────┘
```

### Cart State Flow

```
┌────────┐     ┌──────────┐     ┌──────────┐
│  EMPTY │────▶│  ACTIVE  │────▶│ CLEARED  │
└────────┘     └──────────┘     └──────────┘
                   │
                   │ (items added)
                   ▼
              ┌──────────┐
              │  CHECKOUT│
              └──────────┘
```

## API Interfaces

### Mock Payment API

```typescript
// lib/mock-payment.ts

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

async function processPayment(
  amount: number,
  method: PaymentMethod
): Promise<PaymentResult>
```

**Flow:**
```
processPayment(500, 'card')
  │
  ├─► Delay 2000-3000ms (simulate network)
  │
  ├─► Random: success (90%) or failure (10%)
  │
  ├─► If success:
  │   └─► return {
  │         success: true,
  │         transactionId: "CARD-{timestamp}-{random}"
  │       }
  │
  └─► If failure:
      └─► return {
            success: false,
            error: "Carta rifiutata dalla banca"
          }
```

### Order Storage API

```typescript
// lib/order-storage.ts

function getOrders(): Order[]
function getOrderById(orderId: string): Order | null
function saveOrder(order: Order): void
function updateOrderStatus(orderId: string, status: OrderStatus): boolean
function deleteOrder(orderId: string): boolean
function clearCart(): void
function generateOrderId(): string
function calculateEstimatedDelivery(): string
```

### Validation API

```typescript
// lib/validation.ts

interface ValidationResult {
  valid: boolean;
  error?: string;
}

function validateEmail(email: string): ValidationResult
function validatePhone(phone: string): ValidationResult
function validatePostalCode(postalCode: string): ValidationResult
function validateName(name: string, field: string): ValidationResult
function validateAddress(address: string): ValidationResult
function validateCity(city: string): ValidationResult
function validateCountry(country: string): ValidationResult
function validateCustomerInfo(customer: CustomerInfo): {
  valid: boolean;
  errors: ValidationError[];
}
function sanitizeInput(input: string): string
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      ERROR HANDLING                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FORM VALIDATION ERRORS                                      │
│  ┌─────────────────────────────────────────────┐           │
│  │ User submits invalid data                   │           │
│  │                                             │           │
│  │ ┌───────────────────────────────────┐      │           │
│  │ │ 1. validateCustomerInfo()         │      │           │
│  │ │    - Returns errors array         │      │           │
│  │ └────────────┬──────────────────────┘      │           │
│  │              │                              │           │
│  │              ▼                              │           │
│  │ ┌───────────────────────────────────┐      │           │
│  │ │ 2. setErrors({                    │      │           │
│  │ │      email: "Email non valida",   │      │           │
│  │ │      phone: "Telefono non valido" │      │           │
│  │ │    })                              │      │           │
│  │ └────────────┬──────────────────────┘      │           │
│  │              │                              │           │
│  │              ▼                              │           │
│  │ ┌───────────────────────────────────┐      │           │
│  │ │ 3. Render errors inline           │      │           │
│  │ │    - Red border on field          │      │           │
│  │ │    - Error message below field    │      │           │
│  │ └───────────────────────────────────┘      │           │
│  └─────────────────────────────────────────────┘           │
│                                                             │
│  PAYMENT ERRORS                                             │
│  ┌─────────────────────────────────────────────┐           │
│  │ processPayment() returns success: false     │           │
│  │                                             │           │
│  │ ┌───────────────────────────────────┐      │           │
│  │ │ 1. Throw error with message       │      │           │
│  │ └────────────┬──────────────────────┘      │           │
│  │              │                              │           │
│  │              ▼                              │           │
│  │ ┌───────────────────────────────────┐      │           │
│  │ │ 2. Catch error in try/catch       │      │           │
│  │ └────────────┬──────────────────────┘      │           │
│  │              │                              │           │
│  │              ▼                              │           │
│  │ ┌───────────────────────────────────┐      │           │
│  │ │ 3. Show error banner              │      │           │
│  │ │    - Red background               │      │           │
│  │ │    - Error message                │      │           │
│  │ │    - Allow retry                  │      │           │
│  │ └───────────────────────────────────┘      │           │
│  └─────────────────────────────────────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Performance Considerations

### localStorage Performance

- **Read:** ~1-5ms (synchronous)
- **Write:** ~1-10ms (synchronous)
- **Limit:** ~5-10MB per domain

**Optimization Tips:**
1. Cache parsed JSON in variables (don't re-parse)
2. Batch writes when possible
3. Use debouncing for frequent updates

### Mock Payment Latency

```typescript
// Simulated 2-3 second delay
const delay = 2000 + Math.random() * 1000;
await new Promise(resolve => setTimeout(resolve, delay));
```

**Why?**
- Simulates real network latency
- Gives user visual feedback
- Prevents accidental double-submit

## Security Flow

```
USER INPUT
    │
    ▼
┌─────────────────────┐
│  SANITIZE INPUT     │
│  - HTML entities    │
│  - XSS prevention   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  VALIDATE INPUT     │
│  - Format checks    │
│  - Length checks    │
│  - Range checks     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  PROCESS DATA       │
│  - Business logic   │
│  - Calculations     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  STORE DATA         │
│  - localStorage     │
│  - No sensitive     │
│    information      │
└─────────────────────┘
```
