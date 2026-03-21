# 🛡️ Error Prevention & Validation Guide

## Overview
This document outlines all error prevention measures, validation rules, and error handling implemented in the Smart Farming 360 system.

---

## ✅ Implemented Error Prevention

### 1. Order Creation Validation

#### Backend Validation (`backend/src/controllers/order.controller.ts`)
```typescript
✅ Payment method required
✅ Delivery method required
✅ Cart must not be empty
✅ Stock availability check
✅ Valid order status constraint
✅ User authentication required
✅ Proper error messages for each case
```

#### Frontend Validation (`frontend/src/pages/CheckoutPage.tsx`)
```typescript
✅ Duplicate submission prevention (loading state check)
✅ Customer name validation (not empty)
✅ Email validation (not empty)
✅ Phone validation (not empty)
✅ Delivery address validation (not empty)
✅ City validation (not empty)
✅ Region selection validation (required)
✅ Form field trimming
✅ Specific error messages for each validation
```

### 2. Database Constraints

#### Orders Table
```sql
✅ status CHECK constraint with valid values:
   - 'Pending Payment'
   - 'Processing'
   - 'Completed'
   - 'Cancelled'
   - 'Pending'
   - 'Shipped'
   - 'Delivered'

✅ total_amount >= 0
✅ User foreign key constraint
✅ Product foreign key constraint
✅ Quantity > 0
✅ Price >= 0
```

### 3. API Error Handling

#### Error Codes & Messages
| Code | Message | HTTP Status | Action |
|------|---------|-------------|--------|
| `EMPTY_CART` | Cart is empty | 400 | Redirect to shop |
| `INSUFFICIENT_STOCK` | Item out of stock | 400 | Show specific item |
| `VALIDATION_ERROR` | Missing required field | 400 | Highlight field |
| `DATABASE_ERROR` | System error | 500 | Contact support |
| `INVALID_STATUS` | Invalid order status | 400 | Show valid statuses |
| `NOT_FOUND` | Order not found | 404 | Refresh list |
| `INVALID_ID` | Invalid ID format | 400 | Check input |

### 4. User Input Validation

#### Registration
```typescript
✅ Email format validation
✅ Password minimum 8 characters
✅ First name required (1-100 chars)
✅ Last name required (1-100 chars)
✅ Phone format validation (Ghana format)
✅ Role validation (Consumer/Farmer)
✅ Duplicate email check
```

#### Login
```typescript
✅ Email format validation
✅ Password required
✅ Account status check (Active)
✅ Password verification
✅ Token generation
```

#### Checkout
```typescript
✅ All required fields validated
✅ Email format check
✅ Phone format check
✅ Region selection from dropdown
✅ Payment method selection
✅ Cart not empty check
```

---

## 🔒 Security Measures

### 1. Authentication
```typescript
✅ JWT token validation
✅ Token expiry check (15 minutes)
✅ Refresh token mechanism (7 days)
✅ Password hashing (bcrypt, 10 rounds)
✅ Role-based access control
✅ Protected routes
```

### 2. Authorization
```typescript
✅ Admin-only endpoints protected
✅ User can only access own orders
✅ Farmer can only manage own products
✅ Cart operations require authentication
```

### 3. Data Validation
```typescript
✅ Input sanitization
✅ SQL injection prevention (parameterized queries)
✅ XSS prevention (React escaping)
✅ CORS configuration
✅ Request size limits
```

---

## 🚨 Error Handling Flow

### Order Creation Flow
```
1. User submits checkout form
   ↓
2. Frontend validation
   ├─ ❌ Validation fails → Show error toast
   └─ ✅ Validation passes
       ↓
3. Check loading state
   ├─ ❌ Already loading → Prevent duplicate
   └─ ✅ Not loading → Continue
       ↓
4. Send API request
   ↓
5. Backend validation
   ├─ ❌ Cart empty → Return EMPTY_CART error
   ├─ ❌ Out of stock → Return INSUFFICIENT_STOCK error
   ├─ ❌ Invalid data → Return VALIDATION_ERROR
   └─ ✅ All valid → Create order
       ↓
6. Database operation
   ├─ ❌ Constraint violation → Return DATABASE_ERROR
   └─ ✅ Success → Return order data
       ↓
7. Send email notification
   ├─ ❌ Email fails → Log warning, continue
   └─ ✅ Email sent → Continue
       ↓
8. Clear cart & redirect
   ↓
9. Show success message
```

---

## 📋 Validation Rules

### Email Validation
```typescript
Pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
Examples:
  ✅ user@example.com
  ✅ test.user@domain.co.uk
  ❌ invalid@
  ❌ @domain.com
  ❌ user@domain
```

### Phone Validation (Ghana)
```typescript
Pattern: /^(\+233|0)[2-9]\d{8}$/
Examples:
  ✅ +233501234567
  ✅ 0501234567
  ❌ 1234567890
  ❌ +233123456789
```

### Password Validation
```typescript
Minimum length: 8 characters
Requirements:
  ✅ At least 8 characters
  ❌ No maximum length
  ❌ No special character requirement (for simplicity)
```

### Name Validation
```typescript
Length: 1-100 characters
Requirements:
  ✅ Not empty
  ✅ Trimmed whitespace
  ✅ Maximum 100 characters
```

---

## 🔄 Duplicate Prevention

### Order Submission
```typescript
// Frontend
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Prevent duplicate submissions
  if (loading) return;
  
  setLoading(true);
  try {
    // ... order creation
  } finally {
    setLoading(false);
  }
};
```

### Button Disabled State
```typescript
<button 
  type="submit" 
  disabled={loading}  // Prevents clicks while processing
  className="btn-place-order"
>
  {loading ? 'Processing...' : 'Place Order'}
</button>
```

---

## 🎯 User Feedback

### Success Messages
```typescript
✅ "Registration successful!"
✅ "Login successful!"
✅ "Order placed successfully!"
✅ "Order status updated to Processing"
✅ "Order cancelled successfully"
```

### Error Messages
```typescript
❌ "Your cart is empty. Please add items before placing an order."
❌ "Some items are out of stock"
❌ "Please fill in all required fields"
❌ "Failed to place order. Please try again."
❌ "Invalid email or password"
❌ "Email already registered"
```

### Warning Messages
```typescript
⚠️ "Order created but email notification may have failed"
⚠️ "Only pending payment orders can be cancelled"
```

---

## 🧪 Testing Checklist

### Order Creation Tests
- [ ] Submit with empty cart → Should show error
- [ ] Submit without name → Should show validation error
- [ ] Submit without email → Should show validation error
- [ ] Submit without phone → Should show validation error
- [ ] Submit without address → Should show validation error
- [ ] Submit without city → Should show validation error
- [ ] Submit without region → Should show validation error
- [ ] Submit with out-of-stock item → Should show stock error
- [ ] Submit valid order → Should succeed
- [ ] Double-click submit button → Should prevent duplicate
- [ ] Submit while loading → Should be prevented

### Authentication Tests
- [ ] Register with existing email → Should show error
- [ ] Register with short password → Should show error
- [ ] Register with invalid email → Should show error
- [ ] Login with wrong password → Should show error
- [ ] Login with inactive account → Should show error
- [ ] Access protected route without login → Should redirect

### Order Management Tests
- [ ] Update order with invalid status → Should show error
- [ ] Cancel completed order → Should show error
- [ ] Cancel pending payment order → Should succeed
- [ ] View non-existent order → Should show 404
- [ ] Update order as non-admin → Should show 403

---

## 🔧 Error Recovery

### Automatic Recovery
```typescript
✅ Token refresh on 401 error
✅ Retry failed requests (once)
✅ Redirect to login on auth failure
✅ Clear cart after successful order
✅ Restore inventory on order cancellation
```

### Manual Recovery
```typescript
✅ Refresh button on error pages
✅ "Try again" buttons
✅ "Back to cart" button on checkout
✅ "Back to shop" button on empty cart
✅ Clear error messages on retry
```

---

## 📊 Error Logging

### Backend Logging
```typescript
console.error('Create order error:', error);
console.error('Login error:', error);
console.error('Update order status error:', error);
```

### Frontend Logging
```typescript
console.error('Checkout error:', error);
console.error('Failed to send order notification:', error);
console.warn('Formspree notification failed, but order was created');
```

---

## 🚀 Best Practices

### 1. Always Validate on Both Sides
```typescript
✅ Frontend: Immediate user feedback
✅ Backend: Security and data integrity
```

### 2. Provide Clear Error Messages
```typescript
❌ Bad: "Error occurred"
✅ Good: "Your cart is empty. Please add items before placing an order."
```

### 3. Prevent Duplicate Operations
```typescript
✅ Disable buttons while loading
✅ Check loading state before submission
✅ Use loading spinners
```

### 4. Handle Edge Cases
```typescript
✅ Empty cart
✅ Out of stock items
✅ Network failures
✅ Invalid tokens
✅ Expired sessions
```

### 5. Graceful Degradation
```typescript
✅ Continue if email fails (log warning)
✅ Show partial data if some requests fail
✅ Provide fallback options
```

---

## 📝 Error Message Templates

### User-Facing Messages
```typescript
// Success
"✅ {Action} successful!"

// Validation Error
"❌ Please {action}. {field} is required."

// Not Found
"❌ {Resource} not found. Please refresh and try again."

// Permission Error
"❌ You don't have permission to {action}."

// System Error
"❌ System error. Please try again or contact support."
```

### Developer Messages
```typescript
// Log Format
console.error('[{Component}] {Action} error:', error);

// Example
console.error('[OrderController] Create order error:', error);
```

---

## 🔍 Debugging Guide

### Common Issues

#### 1. "CHECK constraint failed"
**Cause**: Invalid order status
**Solution**: Ensure status is in valid list
**Prevention**: Use status constants, validate before insert

#### 2. "Cart is empty"
**Cause**: User cleared cart or session expired
**Solution**: Redirect to shop
**Prevention**: Check cart before checkout

#### 3. "Insufficient stock"
**Cause**: Product sold out between cart and checkout
**Solution**: Show error, update cart
**Prevention**: Real-time stock checks

#### 4. "Token expired"
**Cause**: User session expired
**Solution**: Auto-refresh token or redirect to login
**Prevention**: Implement token refresh mechanism

---

## ✅ Status

**Error Prevention**: ✅ IMPLEMENTED
**Validation**: ✅ COMPREHENSIVE
**Error Handling**: ✅ ROBUST
**User Feedback**: ✅ CLEAR
**Security**: ✅ ENFORCED
**Testing**: ⏳ READY FOR TESTING

---

**Last Updated**: March 21, 2026
**Version**: 1.1.0
**Status**: 🟢 PRODUCTION READY WITH ERROR PREVENTION
