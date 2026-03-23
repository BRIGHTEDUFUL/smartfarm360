# Order Placement System - Complete Test Guide

## System Overview

The order placement system is **FULLY IMPLEMENTED** with the following components:

### ✅ Database Schema
- `orders` table with all required fields
- `order_items` table linking orders to products and farmers
- Proper foreign key relationships
- Status tracking (Pending Payment, Processing, Completed, Cancelled)

### ✅ Backend API
- **POST /api/orders** - Create new order
- **GET /api/orders** - Get user's orders (filtered by role)
- **GET /api/orders/:id** - Get specific order details
- **PUT /api/orders/:id/status** - Update order status (Admin/Farmer)
- **POST /api/orders/:id/cancel** - Cancel pending orders

### ✅ Frontend Flow
1. User adds items to cart
2. User goes to checkout page
3. User fills in delivery details
4. User selects payment method
5. Order is created with "Pending Payment" status
6. Email notification sent to admin via Formspree
7. Cart is cleared
8. User redirected to orders page

### ✅ Email Notifications
- Formspree integration (https://formspree.io/f/xgvljoyv)
- Sends formatted order details to admin
- Includes customer info, items, total, delivery address

### ✅ Admin/Farmer Dashboards
- View all orders
- Update order status
- Confirm payments (Pending Payment → Processing)
- Mark as completed (Processing → Completed)
- View order details in modal

## Testing Steps

### 1. Test Order Creation

**As Consumer:**
```
1. Login as: consumer@test.com / consumer123
2. Go to Shop page
3. Add products to cart
4. Go to Cart page
5. Click "Proceed to Checkout"
6. Fill in all required fields:
   - Full Name
   - Email
   - Phone
   - Street Address
   - City
   - Region (select from dropdown)
   - Payment Method (Cash on Delivery, Mobile Money, or Bank Transfer)
   - Notes (optional)
7. Click "Place Order"
8. Should see success message
9. Should be redirected to Orders page
10. Should see new order with "Pending Payment" status
```

### 2. Test Email Notification

**Check Admin Email:**
```
1. After placing order, check the email configured in Formspree
2. Should receive email with:
   - Subject: "🛒 New Order #[ID] - Smart Farming 360"
   - Order ID
   - Customer details
   - Delivery address
   - Payment method
   - Order items with quantities and prices
   - Total amount
   - Order status
   - Order date/time
```

### 3. Test Farmer Dashboard

**As Farmer:**
```
1. Login as: farmer1@test.com / farmer123
2. Go to Farmer Dashboard
3. Click "Orders" tab
4. Should see orders containing their products
5. Click "View Details" on an order
6. Should see:
   - Order ID and date
   - Customer information
   - Delivery address
   - Payment method
   - Order items
   - Total amount
   - Current status
7. If status is "Pending Payment":
   - Click "Confirm Payment"
   - Status should change to "Processing"
8. If status is "Processing":
   - Click "Mark as Completed"
   - Status should change to "Completed"
```

### 4. Test Admin Dashboard

**As Admin:**
```
1. Login as: admin@smartfarming.com / admin123
2. Go to Admin Dashboard
3. Click "Orders" tab
4. Should see ALL orders from all users
5. Can update order status
6. Can view order details
```

### 5. Test Order Cancellation

**As Consumer:**
```
1. Go to Orders page
2. Find order with "Pending Payment" status
3. Click "Cancel Order"
4. Confirm cancellation
5. Order status should change to "Cancelled"
6. Product inventory should be restored
```

## Common Issues & Solutions

### Issue 1: "Cart is empty" error
**Solution:** Make sure you have items in cart before going to checkout

### Issue 2: Order not appearing in dashboard
**Solution:** 
- Check if you're logged in
- Refresh the page
- Check browser console for errors

### Issue 3: Email not received
**Solution:**
- Email notification failure doesn't stop order creation
- Order is still saved in database
- Admin can see it in dashboard
- Check spam folder

### Issue 4: "Insufficient stock" error
**Solution:** Product doesn't have enough inventory. Admin needs to update stock.

### Issue 5: Can't update order status
**Solution:** 
- Only farmers can update orders containing their products
- Only admin can update all orders
- Can only confirm payment if status is "Pending Payment"
- Can only mark complete if status is "Processing"

## Database Verification

To check if orders are being created, run these queries in the backend:

```sql
-- Check recent orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;

-- Check order items
SELECT oi.*, p.name, o.status 
FROM order_items oi
JOIN products p ON oi.product_id = p.id
JOIN orders o ON oi.order_id = o.id
ORDER BY oi.id DESC LIMIT 10;

-- Check orders by status
SELECT status, COUNT(*) as count 
FROM orders 
GROUP BY status;
```

## API Testing with cURL

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "payment_method": "Cash on Delivery",
    "delivery_method": "Home Delivery",
    "delivery_address": "123 Main St, Accra, Greater Accra",
    "notes": "Please call before delivery"
  }'
```

### Get Orders
```bash
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Order Status
```bash
curl -X PUT http://localhost:5000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status": "Processing"}'
```

## System Status

✅ **Database**: Orders and order_items tables exist and working
✅ **Backend API**: All endpoints implemented and tested
✅ **Frontend**: Checkout page fully functional
✅ **Email**: Formspree integration working
✅ **Dashboards**: Admin and Farmer can view/manage orders
✅ **Validation**: All required fields validated
✅ **Error Handling**: Comprehensive error messages
✅ **Inventory**: Stock reduced on order, restored on cancellation

## Next Steps (If Issues Persist)

1. **Check Browser Console**: Look for JavaScript errors
2. **Check Network Tab**: See if API calls are succeeding
3. **Check Backend Logs**: Look for server errors
4. **Verify Authentication**: Make sure user is logged in
5. **Clear Cache**: Clear browser cache and reload
6. **Test with Different Browser**: Rule out browser-specific issues

## Support

If you're still experiencing issues:
1. Check the browser console (F12) for errors
2. Check the backend terminal for error logs
3. Verify you're using the correct test accounts
4. Make sure both backend and frontend servers are running
5. Try placing an order with a fresh cart

---

**Last Updated**: 2024
**Status**: ✅ FULLY FUNCTIONAL
