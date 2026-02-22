# Testing Checklist - DENIF E-commerce Demo

## Overview

This document provides a comprehensive testing checklist for the DENIF e-commerce demo. Use this checklist to verify all functionality works correctly before deployment or demos.

## Test Environment

- [ ] **Browser:** Chrome, Firefox, Safari, Edge
- [ ] **Device:** Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
- [ ] **Network:** Throttle to 3G for testing loading states
- [ ] **localStorage:** Clear before testing

---

## Section 1: Navigation & UI (T001-T010)

### T001: Homepage Loads
- [ ] Visit `/`
- [ ] Logo visible
- [ ] Navigation menu visible
- [ ] Footer visible
- [ ] No console errors

### T002: Catalog Page Access
- [ ] Click "Catalogo" in navigation
- [ ] URL changes to `/catalogo`
- [ ] Products displayed
- [ ] Filters visible
- [ ] No console errors

### T003: Chi Sono Page Access
- [ ] Click "Chi Sono" in navigation
- [ ] URL changes to `/chi-sono`
- [ ] Content visible
- [ ] No console errors

### T004: I Miei Ordini Link
- [ ] "I Miei Ordini" visible in navigation
- [ ] Click link
- [ ] Redirect to `/ordini`
- [ ] Page loads correctly

### T005: Footer Links
- [ ] Footer visible on all pages
- [ ] "Catalogo" link works
- [ ] "Chi Sono" link works
- [ ] "I Miei Ordini" link works
- [ ] Contact links (WhatsApp, Email) work

### T006: Mobile Navigation
- [ ] View on mobile width (<768px)
- [ ] Hamburger menu visible
- [ ] Menu opens on click
- [ ] All links accessible
- [ ] Menu closes on link click

### T007: Cart Icon Visible
- [ ] Cart icon visible in header
- [ ] Badge shows correct count
- [ ] Badge hidden when cart empty
- [ ] Click opens cart drawer

### T008: Responsive Design - Desktop
- [ ] View at 1920x1080
- [ ] Layout displays correctly
- [ ] Images properly sized
- [ ] Text readable
- [ ] No horizontal overflow

### T009: Responsive Design - Tablet
- [ ] View at 768x1024
- [ ] Layout stacks correctly
- [ ] Form inputs accessible
- [ ] Buttons properly sized
- [ ] No broken elements

### T010: Responsive Design - Mobile
- [ ] View at 375x667
- [ ] Single column layout
- [ ] Touch targets minimum 44px
- [ ] Text readable without zoom
- [ ] No horizontal scrolling

---

## Section 2: Shopping Cart (T011-T030)

### T011: Add Product to Cart
- [ ] Navigate to catalog
- [ ] Click "Add to Cart" on product
- [ ] Cart drawer opens automatically
- [ ] Product visible in cart
- [ ] Cart count increases

### T012: Add Multiple Items - Same Size
- [ ] Add product (size 38) twice
- [ ] Quantity shows 2
- [ ] Only one row in cart
- [ ] Total calculated correctly

### T013: Add Multiple Items - Different Sizes
- [ ] Add product (size 38)
- [ ] Add same product (size 39)
- [ ] Two rows in cart
- [ ] Each shows correct size
- [ ] Total calculated correctly

### T014: Cart Drawer Open/Close
- [ ] Click cart icon
- [ ] Drawer slides in from right
- [ ] Backdrop visible
- [ ] Click backdrop closes drawer
- [ ] Click close button closes drawer

### T015: Increase Quantity
- [ ] Click + button on cart item
- [ ] Quantity increments
- [ ] Total updates
- [ ] Cart count updates

### T016: Decrease Quantity
- [ ] Click - button on cart item (quantity > 1)
- [ ] Quantity decrements
- [ ] Total updates
- [ ] Cart count updates

### T017: Remove Item (Quantity 1)
- [ ] Click - button on cart item (quantity = 1)
- [ ] Item removed from cart
- [ ] Cart recalculates
- [ ] Cart count updates

### T018: Clear Cart
- [ ] Add multiple items to cart
- [ ] Clear localStorage
- [ ] Cart shows empty state
- [ ] Cart count hidden

### T019: Cart Persistence - Page Reload
- [ ] Add items to cart
- [ ] Reload page
- [ ] Cart items preserved
- [ ] Quantities preserved
- [ ] Total preserved

### T020: Cart Persistence - Navigation
- [ ] Add items to cart
- [ ] Navigate to different page
- [ ] Return to catalog
- [ ] Cart items preserved
- [ ] Cart count correct

### T021: Empty Cart State
- [ ] Visit with empty cart
- [ ] Cart drawer shows empty message
- [ ] Cart count hidden
- [ ] No footer visible in cart

### T022: Cart Totals Calculation
- [ ] Add item €280 x 2 = €560
- [ ] Add item €120 x 1 = €120
- [ ] Subtotal shows €680
- [ ] Total shows €680 (no shipping yet)

### T023: Free Shipping Threshold
- [ ] Add items totalling €200+
- [ ] Shipping shows "Gratis"
- [ ] Free shipping badge visible
- [ ] Total = subtotal (no shipping added)

### T024: Shipping Cost Under Threshold
- [ ] Add items totalling <€200
- [ ] Shipping shows €10.00
- [ ] Total = subtotal + €10
- [ ] No free shipping badge

### T025: Cart at Free Shipping Boundary
- [ ] Add items totalling €199
- [ ] Shipping shows €10.00
- [ ] Add €1 item (total €200)
- [ ] Shipping changes to "Gratis"

### T026: Cart Item Display
- [ ] Item image visible
- [ ] Item name visible
- [ ] Item size visible
- [ ] Item price visible
- [ ] Item quantity editable

### T027: Cart Count Update
- [ ] Add 3 items (quantities: 2, 1, 1)
- [ ] Cart badge shows 4
- [ ] Add another item (quantity: 2)
- [ ] Cart badge shows 6

### T028: Cart Close on Background Click
- [ ] Open cart drawer
- [ ] Click backdrop
- [ ] Drawer closes
- [ ] No errors

### T029: Cart Close on Escape Key
- [ ] Open cart drawer
- [ ] Press Escape
- [ ] Drawer closes
- [ ] No errors

### T030: Cart Items Maximum
- [ ] Add 10+ items
- [ ] Scroll appears in cart items
- [ ] All items accessible
- [ ] No performance issues

---

## Section 3: Checkout Form (T031-T060)

### T031: Access Checkout Page
- [ ] Have items in cart
- [ ] Click "Procedi al Checkout"
- [ ] Navigate to `/checkout`
- [ ] Page loads without errors

### T032: Checkout Page - Empty Cart Redirect
- [ ] Clear cart (localStorage)
- [ ] Visit `/checkout` directly
- [ ] Redirected to `/catalogo`
- [ ] Empty cart message shown

### T033: Checkout Page Layout
- [ ] Form visible on left
- [ ] Order summary visible on right
- [ ] Form fields properly labeled
- [ ] Submit button visible

### T034: Required Field Indicators
- [ ] All required fields marked with *
- [ ] Clear visual hierarchy
- [ ] Labels associated with inputs

### T035: Form Field - First Name
- [ ] Field visible and labeled
- [ ] Placeholder shows example
- [ ] Required field validation
- [ ] Focus styles applied

### T036: Form Field - Last Name
- [ ] Field visible and labeled
- [ ] Placeholder shows example
- [ ] Required field validation
- [ ] Focus styles applied

### T037: Form Field - Email
- [ ] Field visible and labeled
- [ ] Type="email" for mobile keyboard
- [ ] Placeholder shows format
- [ ] Email validation works

### T038: Form Field - Phone
- [ ] Field visible and labeled
- [ ] Type="tel" for mobile keyboard
- [ ] Placeholder shows format
- [ ] Phone validation works

### T039: Form Field - Address
- [ ] Field visible and labeled
- [ ] Sufficient width for address
- [ ] Required field validation
- [ ] Accepts common formats

### T040: Form Field - City
- [ ] Field visible and labeled
- [ ] Required field validation
- [ ] Accepts Italian city names

### T041: Form Field - CAP
- [ ] Field visible and labeled
- [ ] Maxlength 5 enforced
- [ ] CAP validation works
- [ ] Only numbers accepted

### T042: Form Field - Country
- [ ] Field visible and labeled
- [ ] Pre-filled with "Italia"
- [ ] Editable if needed
- [ ] Required field validation

### T043: Form Field - Notes (Optional)
- [ ] Field visible and labeled
- [ ] Not required (can be empty)
- [ ] Textarea allows multiple lines
- [ ] Placeholder shows purpose

### T044: Payment Method Selection
- [ ] Three options visible
- [ ] Icons displayed for each
- [ ] Radio button behavior
- [ ] Descriptions visible

### T045: Payment Method - Card
- [ ] Option selectable
- [ ] Visual feedback when selected
- [ ] Shows "Carta di Credito/Debito"
- [ ] Shows card icon

### T046: Payment Method - PayPal
- [ ] Option selectable
- [ ] Visual feedback when selected
- [ ] Shows "PayPal"
- [ ] Shows PayPal icon

### T047: Payment Method - Bank Transfer
- [ ] Option selectable
- [ ] Visual feedback when selected
- [ ] Shows "Bonifico Bancario"
- [ ] Shows bank icon

### T048: Form Validation - Empty Submit
- [ ] Leave all fields empty
- [ ] Click "Completa Ordine"
- [ ] Inline errors shown
- [ ] Form not submitted

### T049: Form Validation - Email
- [ ] Enter invalid email: "test@"
- [ ] Blur field
- [ ] Error shown immediately
- [ ] "Email non valida"
- [ ] Red border on field

### T050: Form Validation - Email Valid
- [ ] Enter valid email: "test@email.it"
- [ ] Blur field
- [ ] No error shown
- [ ] Border remains neutral

### T051: Form Validation - Phone Invalid
- [ ] Enter "123456789" (9 digits)
- [ ] Blur field
- [ ] Error shown
- [ ] "Telefono non valido"

### T052: Form Validation - Phone Valid
- [ ] Enter "3123456789" (10 digits, starts with 3)
- [ ] Blur field
- [ ] No error shown

### T053: Form Validation - CAP Invalid
- [ ] Enter "1234" (4 digits)
- [ ] Blur field
- [ ] Error shown
- [ ] "CAP non valido"

### T054: Form Validation - CAP Valid
- [ ] Enter "00100" (5 digits)
- [ ] Blur field
- [ ] No error shown

### T055: Form Validation - Name Too Short
- [ ] Enter single character
- [ ] Blur field
- [ ] Error shown
- [ ] "Nome deve essere almeno 2 caratteri"

### T056: Real-time Validation
- [ ] Type invalid email
- [ ] Tab to next field
- [ ] Error appears immediately
- [ ] No need to submit form

### T057: Error Message Clear on Fix
- [ ] Trigger validation error
- [ ] Fix the input
- [ ] Error message disappears
- [ ] Border returns to normal

### T058: Form Submit with Valid Data
- [ ] Fill all fields with valid data
- [ ] Select payment method
- [ ] Click "Completa Ordine"
- [ ] No validation errors
- [ ] Loading state shown

### T059: Loading State During Submit
- [ ] Submit form
- [ ] Button shows spinner
- [ ] Button text: "Elaborazione in corso..."
- [ ] Button disabled
- [ ] Fields disabled

### T060: Form Reset After Error
- [ ] Submit and get payment error
- [ ] Loading state ends
- [ ] Form data preserved
- [ ] Can retry submission

---

## Section 4: Order Summary in Checkout (T061-T070)

### T061: Order Summary Display
- [ ] Visible in checkout
- [ ] Shows all cart items
- [ ] Sticky on scroll (desktop)
- [ ] Properly styled

### T062: Order Summary - Items
- [ ] All items from cart shown
- [ ] Images displayed
- [ ] Names visible
- [ ] Sizes shown
- [ ] Quantities shown

### T063: Order Summary - Totals
- [ ] Subtotal shown correctly
- [ ] Shipping shown correctly
- [ ] Total prominent
- [ ] Calculations accurate

### T064: Order Summary - Free Shipping
- [ ] Order over €200
- [ ] "Gratis" shown for shipping
- [ ] Green badge visible
- [ ] Encouraging message

### T065: Order Summary - Paid Shipping
- [ ] Order under €200
- [ ] "€10.00" shown for shipping
- [ ] No green badge
- [ ] Total includes shipping

### T066: Order Summary - Delivery Estimate
- [ ] Blue banner visible
- [ ] "3-5 giorni lavorativi" shown
- [ ] Calendar icon visible
- [ ] Professional messaging

### T067: Order Summary - Security Badge
- [ ] Lock icon visible
- [ ] "Pagamento sicuro" text
- [ ] reassuring message
- [ ] Bottom of summary

### T068: Order Summary Update
- [ ] Add item to cart before checkout
- [ ] Summary updates immediately
- [ ] Totals recalculate
- [ ] No page refresh needed

### T069: Order Summary Scroll
- [ ] Long list of items
- [ ] Summary has scroll
- [ ] Max height enforced
- [ ] Scrollbar styled

### T070: Order Summary Responsive
- [ ] Desktop: Right side column
- [ ] Tablet: Below form
- [ ] Mobile: Below form
- [ ] Always readable

---

## Section 5: Payment Processing (T071-T085)

### T071: Payment Success
- [ ] Submit valid form
- [ ] Wait 2-3 seconds
- [ ] Success response (90% of time)
- [ ] Redirect to confirmation

### T072: Payment Failure
- [ ] Submit valid form
- [ ] Wait 2-3 seconds
- [ ] Failure response (10% of time)
- [ ] Error message shown
- [ ] Can retry

### T073: Payment Delay
- [ ] Submit form
- [ ] Loading appears immediately
- [ ] Wait minimum 2 seconds
- [ ] Wait maximum 3 seconds
- [ ] Response received

### T074: Transaction ID Generated
- [ ] Complete payment successfully
- [ ] Transaction ID created
- [ ] Format: CARD-{timestamp}-{random}
- [ ] ID unique

### T075: Payment Method - Card Transaction ID
- [ ] Select card payment
- [ ] Complete order
- [ ] Transaction ID starts with "CARD-"
- [ ] ID shown on confirmation

### T076: Payment Method - PayPal Transaction ID
- [ ] Select PayPal
- [ ] Complete order
- [ ] Transaction ID starts with "PAYPAL-"
- [ ] ID shown on confirmation

### T077: Payment Method - Bank Transfer
- [ ] Select bank transfer
- [ ] Complete order
- [ ] Transaction ID starts with "BANK-"
- [ ] ID shown on confirmation

### T078: Payment Error Messages
- [ ] Trigger card failure
- [ ] Error specific to card
- [ ] Message in Italian
- [ ] User-friendly text

### T079: Payment Retry
- [ ] Get payment failure
- [ ] Click retry or submit again
- [ ] Form data preserved
- [ ] New payment attempt made

### T080: Payment Loading Cannot Close
- [ ] Submit form
- [ ] During loading, try to close page
- [ ] Or try to resubmit
- [ ] Form protected
- [ ] No duplicate orders

### T081: Order Creation
- [ ] Payment successful
- [ ] Order object created
- [ ] Order ID generated
- [ ] Status set to "confirmed"

### T082: Order Totals Calculation
- [ ] Subtotal = sum of items
- [ ] Shipping = €0 (if ≥€200) or €10
- [ ] Total = subtotal + shipping
- [ ] Stored correctly in order

### T083: Cart Cleared After Order
- [ ] Complete order
- [ ] Check localStorage
- [ ] `denif-cart` removed
- [ ] Cart count hidden

### T084: Order Saved to Storage
- [ ] Complete order
- [ ] Check localStorage
- [ ] `denif-orders` exists
- [ ] Order in orders array

### T085: Estimated Delivery Calculation
- [ ] Complete order
- [ ] Delivery date calculated
- [ ] 3-5 days in future
- [ ] Date in ISO format

---

## Section 6: Order Confirmation (T086-T100)

### T086: Access Confirmation Page
- [ ] Complete order successfully
- [ ] Redirected to `/ordine-confermato`
- [ ] Order ID in URL
- [ ] Page loads without errors

### T087: Confirmation Page - Invalid Order ID
- [ ] Visit `/ordine-confermato?orderId=INVALID`
- [ ] Error message shown
- [ ] "Ordine non trovato"
- [ ] Link to catalog

### T088: Confirmation Success Animation
- [ ] Green checkmark visible
- [ ] Animation plays
- [ ] "Ordine Confermato!" heading
- [ ] Celebratory design

### T089: Confirmation - Order ID
- [ ] Order ID displayed prominently
- [ ] Format: ORD-YYYY-XXXXXX
- [ ] ID matches created order
- [ ] Copyable text

### T090: Confirmation - Order Date
- [ ] Date shown
- [ ] Format: Italian date
- [ ] Time included
- [ ] Matches order creation

### T091: Confirmation - Customer Info
- [ ] Name shown
- [ ] Email shown
- [ ] Phone shown
- [ ] Address shown
- [ ] City, CAP, Country shown

### T092: Confirmation - Order Items
- [ ] All items listed
- [ ] Images shown
- [ ] Names shown
- [ ] Sizes and quantities shown
- [ ] Subtotals shown

### T093: Confirmation - Totals
- [ ] Subtotal shown
- [ ] Shipping shown
- [ ] Total prominent
- [ ] Calculations accurate

### T094: Confirmation - Delivery Estimate
- [ ] Blue banner visible
- [ ] Date range shown
- [ ] "Entro il [date]" text
- [ ] Italian weekday name

### T095: Confirmation - Payment Info
- [ ] Payment method shown
- [ ] Method name in Italian
- [ ] Transaction ID shown
- [ ] Format: XXX-{timestamp}-{random}

### T096: Confirmation - Continue Shopping Button
- [ ] Button visible
- [ ] Links to `/catalogo`
- [ ] Icon visible
- [ ] Hover effects

### T097: Confirmation - View Orders Button
- [ ] Button visible
- [ ] Links to `/ordini`
- [ ] Icon visible
- [ ] Prominent CTA

### T098: Confirmation Page Responsive
- [ ] Desktop: Centered, max-width
- [ ] Tablet: Full width, readable
- [ ] Mobile: Stacked, accessible
- [ ] All content visible

### T099: Confirmation - No Console Errors
- [ ] Load confirmation page
- [ ] Check browser console
- [ ] No JavaScript errors
- [ ] No warnings

### T100: Confirmation - Print Friendly
- [ ] Print page (Ctrl+P)
- [ ] Layout prints well
- [ ] Order details visible
- [ ] No cut-off content

---

## Section 7: Order History (T101-T120)

### T101: Access Order History
- [ ] Click "I Miei Ordini"
- [ ] Navigate to `/ordini`
- [ ] Page loads
- [ ] No console errors

### T102: Order History - No Orders
- [ ] Clear localStorage
- [ ] Visit `/ordini`
- [ ] "Nessun ordine trovato" message
- [ ] "Inizia lo Shopping" button

### T103: Order History - With Orders
- [ ] Complete 2-3 orders
- [ ] Visit `/ordini`
- [ ] All orders listed
- [ ] Most recent first

### T104: Order Card Display
- [ ] Order ID shown
- [ ] Date shown
- [ ] Status badge shown
- [ ] Items preview shown
- [ ] Total shown

### T105: Order Status Badge - Pending
- [ ] Order with status "pending"
- [ ] Yellow badge
- [ ] "In Attesa" text

### T106: Order Status Badge - Confirmed
- [ ] Order with status "confirmed"
- [ ] Green badge
- [ ] "Confermato" text

### T107: Order Status Badge - Processing
- [ ] Order with status "processing"
- [ ] Blue badge
- [ ] "In Elaborazione" text

### T108: Order Status Badge - Shipped
- [ ] Order with status "shipped"
- [ ] Purple badge
- [ ] "Spedito" text

### T109: Order Status Badge - Delivered
- [ ] Order with status "delivered"
- [ ] Gray badge
- [ ] "Consegnato" text

### T110: Order Status Badge - Cancelled
- [ ] Order with status "cancelled"
- [ ] Red badge
- [ ] "Cancellato" text

### T111: View Order Details - Button
- [ ] Click "Vedi Dettagli →"
- [ ] Modal opens
- [ ] Order details shown
- [ ] Backdrop visible

### T112: View Order Details - Card Click
- [ ] Click anywhere on order card
- [ ] Modal opens
- [ | Same details as button
- [ ] Intuitive behavior

### T113: Order Modal - Content
- [ ] Order ID shown
- [ ] Order date shown
- [ ] Status shown
- [ ] All items listed
- [ ] Totals breakdown shown

### T114: Order Modal - Items
- [ ] Item images shown
- [ ] Item names shown
- [ ] Sizes and quantities shown
- [ ] Item subtotals shown

### T115: Order Modal - Totals
- [ ] Subtotal shown
- [ ] Shipping shown
- [ ] Total prominent
- [ ] Calculations accurate

### T116: Order Modal - Delivery Estimate
- [ ] If delivery date exists
- [ ] Blue banner shown
- [ ] Date formatted in Italian
- [ ] Weekday shown

### T117: Order Modal - Close Button
- [ ] X button visible
- [ ] Click closes modal
- [ ] Backdrop remains
- [ ] Smooth animation

### T118: Order Modal - Backdrop Click
- [ ] Modal open
- [ ] Click backdrop
- [ ] Modal closes
- [ ] No errors

### T119: Order Modal - Escape Key
- [ ] Modal open
- [ ] Press Escape
- [ ] Modal closes
- [ ] Proper focus management

### T120: Order History Responsive
- [ ] Desktop: Cards in column
- [ ] Tablet: Cards readable
- [ ] Mobile: Stacked layout
- [ ] Modal full width on mobile

---

## Section 8: End-to-End Scenarios (T121-T130)

### T121: Complete E2E Flow - Single Item
1. [ ] Visit `/catalogo`
2. [ ] Add product to cart
3. [ ] Click "Procedi al Checkout"
4. [ ] Fill form with valid data
5. [ ] Submit form
6. [ ] Wait for payment processing
7. [ ] View order confirmation
8. [ ] Verify order details
9. [ ] Visit `/ordini`
10. [ ] Verify order in history

### T122: Complete E2E Flow - Multiple Items
1. [ ] Visit `/catalogo`
2. [ ] Add 3 different products
3. [ ] Adjust quantities
4. [ ] Proceed to checkout
5. [ ] Complete form
6. [ ] Submit order
7. [ ] View confirmation
8. [ ] Verify all items listed

### T123: E2E - Form Validation Error Path
1. [ ] Add to cart
2. [ ] Go to checkout
3. [ ] Submit with invalid data
4. [ ] See validation errors
5. [ ] Fix all errors
6. [ ] Submit again
7. [ ] Order succeeds

### T124: E2E - Payment Failure Path
1. [ ] Complete form correctly
2. [ ] Submit order
3. [ ] Get payment error (10%)
4. [ ] Read error message
5. [ ] Submit again
6. [ ] Order succeeds

### T125: E2E - Free Shipping
1. [ ] Add items totalling €200+
2. [ ] View cart
3. [ ] Verify "Gratis" shipping
4. [ ] Complete checkout
5. [ ] Verify no shipping charge

### T126: E2E - Paid Shipping
1. [ ] Add items totalling <€200
2. [ ] View cart
3. [ ] Verify €10 shipping
4. [ ] Complete checkout
5. [ ] Verify shipping in total

### T127: E2E - Cart Persistence
1. [ ] Add items to cart
2. [ ] Close browser tab
3. [ ] Reopen browser
4. [ ] Visit site
5. [ ] Verify cart still has items
6. [ ] Quantities preserved

### T128: E2E - Multiple Orders
1. [ ] Complete first order
2. [ ] Verify cart empty
3. [ ] Add new items
4. [ ] Complete second order
5. [ ] Visit `/ordini`
6. [ ] Verify both orders listed

### T129: E2E - All Payment Methods
1. [ ] Complete order with Card
2. [ ] Complete order with PayPal
3. [ ] Complete order with Bank Transfer
4. [ ] View order history
5. [ ] Verify all orders
6. [ ] Verify different transaction IDs

### T130: E2E - Mobile Experience
1. [ ] Use mobile viewport (375x667)
2. [ ] Browse catalog
3. [ ] Add to cart
4. [ ] Complete checkout
5. [ ] View confirmation
6. [ ] All elements accessible

---

## Section 9: Edge Cases (T131-T145)

### T131: Very Long Name
- [ ] Enter 50 character name
- [ ] Should accept
- [ ] Enter 51 character name
- [ ] Should reject or truncate

### T132: Special Characters in Name
- [ ] Enter "Maria-Giuseppa"
- [ ] Enter "D'Angelo"
- [ ] Enter "Àllegrà"
- [ ] All should accept

### T133: Minimum Order Amount
- [ ] Add €5 item
- [ ] Try to checkout
- [ ] Should accept (no minimum in demo)

### T134: Maximum Order Amount
- [ ] Try to exceed €10,000
- [ ] Validation should trigger
- [ ] Error message shown

### T135: CAP - Invalid Range
- [ ] Enter "00000"
- [ ] Should reject
- [ ] Enter "99999"
- [ ] Should reject

### T136: Phone - Wrong Prefix
- [ ] Enter "2123456789" (starts with 2)
- [ ] Should reject
- [ ] Error: "deve iniziare con 3"

### T137: Email - Non-Italian Domain
- [ ] Enter "test@example.co.uk"
- [ ] Should reject or accept based on rules
- [ ] Consistent behavior

### T138: Notes - Maximum Length
- [ ] Type very long note
- [ ] Should accept or have limit
- [ ] No form breakage

### T139: Multiple Rapid Submits
- [ ] Submit form
- [ ] Quickly click submit again
- [ ] Should prevent double submit
- [ ] Only one order created

### T140: Browser Back Button
- [ ] Complete order
- [ ] Click back button
- [ ] Should not resubmit
- [ ] Safe navigation

### T141: localStorage Full
- [ ] Fill localStorage to limit
- [ ] Try to create order
- [ ] Should handle gracefully
- [ ] Error message shown

### T142: Network Offline (Simulation)
- [ ] Set browser offline
- [ ] Try to complete order
- [ ] Should show error
- [ ] No data loss

### T143: Concurrent Cart Modifications
- [ ] Open cart in two tabs
- [ ] Add item in tab 1
- [ ] Add item in tab 2
- [ ] Check behavior
- [ ] Last write wins (expected)

### T144: Very Long Item List
- [ ] Add 15 items to cart
- [ ] View checkout
- [ ] Scroll should work
- [ ] Performance acceptable

### T145: Rapid Add to Cart
- [ ] Rapidly click "Add to Cart"
- [ ] Should not break
- [ ] Proper quantities
- [ ] No duplicate items

---

## Section 10: Cross-Browser Testing (T146-T155)

### T146: Chrome - All Features
- [ ] Test on latest Chrome
- [ ] All features work
- [ ] No console errors
- [ ] Performance good

### T147: Firefox - All Features
- [ ] Test on latest Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Styling correct

### T148: Safari - All Features
- [ ] Test on Safari (Mac/iOS)
- [ ] All features work
- [ ] No console errors
- [ ] Scroll animations work

### T149: Edge - All Features
- [ ] Test on latest Edge
- [ ] All features work
- [ ] No console errors
- [ ] Compatible with Chrome

### T150: Mobile Safari - iOS
- [ ] Test on iPhone
- [ ] Touch interactions work
- [ ] Form inputs accessible
- [ ] Keyboard doesn't hide inputs

### T151: Mobile Chrome - Android
- [ ] Test on Android
- [ ] Touch interactions work
- [ ] Form inputs accessible
- [ ] No layout issues

### T152: localStorage Support
- [ ] Test on all browsers
- [ ] localStorage works
- [ ] Data persists
- [ ] No quota exceeded errors

### T153: CSS Grid Support
- [ ] Layout uses CSS Grid
- [ ] Works in all browsers
- [ ] Fallbacks if needed
- [ ] No broken layouts

### T154: ES6+ Support
- [ ] Arrow functions work
- [ ] Async/await works
- [ ] Template literals work
- [ ] No syntax errors

### T155: Responsive Images
- [ ] Images load correctly
- [ ] No CORS issues
- [ ] Lazy loading works
- [ ] Unsplash images display

---

## Section 11: Performance (T156-T165)

### T156: Initial Page Load
- [ ] Load time < 3 seconds
- [ ] No render blocking
- [ ] Critical CSS inline
- [ ] Progressive loading

### T157: Cart Drawer Animation
- [ ] Smooth slide-in
- [ ] 60fps animation
- [ ] No jank
- [ ] Hardware acceleration

### T158: Form Validation Performance
- [ ] Instant feedback
- [ ] No lag on input
- [ ] Debounced if needed
- [ ] Smooth typing

### T159: Payment Processing
- [ ] 2-3 second delay
- [ ] Consistent timing
- [ ] Loading spinner smooth
- [ ] No UI freeze

### T160: Order History Load
- [ ] Instant load from localStorage
- [ ] No delay
- [ ] All orders render quickly
- [ ] Scroll smooth

### T161: Image Loading
- [ ] Images load progressively
- [ ] No layout shift
- [ ] Lazy loading if applicable
- [ ] Placeholder while loading

### T162: Total Bundle Size
- [ ] Check network tab
- [ ] Bundle < 200KB (reasonable)
- [ ] Code splitting working
- [ ] No unnecessary dependencies

### T163: Memory Leaks
- [ ] Use app for 10 minutes
- [ ] Complete multiple orders
- [ ] Check memory usage
- [ ] No continuous growth

### T164: localStorage Performance
- [ ] Read operations fast
- [ ] Write operations fast
- [ ] No blocking UI
- [ ] Efficient JSON parsing

### T165: Console Warnings
- [ ] No console warnings
- [ ] No deprecation warnings
- [ ] Clean console output
- [ ] Production-ready code

---

## Section 12: Accessibility (T166-T175)

### T166: Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Logical tab order
- [ ] Visible focus indicators
- [ ] All features accessible via keyboard

### T167: Screen Reader - Forms
- [ ] Labels announced
- [ ] Errors announced
- [ ] Required fields indicated
- [ ] Instructions clear

### T168: Screen Reader - Buttons
- [ ] Button purpose announced
- [ ] Cart button: "Carrello"
- [ ] Close button: "Chiudi"
- [ ] Submit button: "Completa Ordine"

### T169: ARIA Labels
- [ ] All icons have labels
- [ ] Form inputs properly labeled
- [ ] Live regions for errors
- [ ] Modal announcements

### T170: Color Contrast
- [ ] Text contrast > 4.5:1
- [ ] Interactive elements > 3:1
- [ ] Error messages readable
- [ ] Status badges readable

### T171: Focus Management
- [ ] Focus moves to modal on open
- [ ] Focus trapped in modal
- [ ] Focus returns after close
- [ ] No focus loss

### T172: Error Accessibility
- [ ] Errors linked to inputs
- [ ] aria-invalid attributes
- [ ] aria-describedby for errors
- [ ] Screen reader friendly

### T173: Touch Targets
- [ ] Minimum 44x44px
- [ ] Adequate spacing
- [ ] No overlapping targets
- [ ] Easy to tap

### T174: Form Instructions
- [ ] Required fields marked
- [ ] Format instructions shown
- [ ] Error messages helpful
- [ ] Clear validation

### T175: Semantic HTML
- [ ] Proper heading hierarchy
- [ ] Nav elements used
- [ ] Button vs link distinction
- [ ] Landmark regions

---

## Test Execution Log

### Date: _______________
### Tester: _______________

| Test ID | Status | Notes |
|---------|--------|-------|
| T001-T010 | ☐ Pass / Fail | Navigation & UI |
| T011-T030 | ☐ Pass / Fail | Shopping Cart |
| T031-T060 | ☐ Pass / Fail | Checkout Form |
| T061-T070 | ☐ Pass / Fail | Order Summary |
| T071-T085 | ☐ Pass / Fail | Payment Processing |
| T086-T100 | ☐ Pass / Fail | Order Confirmation |
| T101-T120 | ☐ Pass / Fail | Order History |
| T121-T130 | ☐ Pass / Fail | E2E Scenarios |
| T131-T145 | ☐ Pass / Fail | Edge Cases |
| T146-T155 | ☐ Pass / Fail | Cross-Browser |
| T156-T165 | ☐ Pass / Fail | Performance |
| T166-T175 | ☐ Pass / Fail | Accessibility |

### Overall Result: _____ Pass / _____ Fail / _____ Total

### Critical Issues Found:
1.
2.
3.

### Recommendations:
1.
2.
3.

---

## Quick Smoke Test (5 minutes)

Rapid test before demo or deployment:

- [ ] Homepage loads
- [ ] Can browse catalog
- [ ] Can add to cart
- [ ] Cart opens and shows items
- [ ] Can access checkout
- [ ] Form validation works
- [ ] Can submit order
- [ ] Order confirmation shows
- [ ] Order appears in history
- [ ] No console errors

---

## Notes

- Adjust test cases as features evolve
- Add regression tests for bug fixes
- Update browser support as needed
- Review quarterly for relevance
