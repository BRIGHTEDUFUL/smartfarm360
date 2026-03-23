# Order Placement Diagnostic Guide

## Issue: Failed to Place Order

### Quick Checks

1. **Is the backend server running?**
   ```bash
   # Check if backend is running on port 5000
   # You should see server logs
   ```

2. **Is the frontend server running?**
   ```bash
   # Check if frontend is running on port 3000
   ```

3. **Check browser console for errors**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for error messages when placing order

4. **Check Network tab**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Try placing order
   - Look for failed requests (red)
   - Click on the failed request to see details

### Common Issues & Solutions

#### Issue 1: "Cart is empty" error
**Solution:** Add items to cart before checkout
- Go to Shop page
- Add products to cart
- Then proceed to checkout

#### Issue 2: "Authentication failed" or 401 error
**Solution:** Re-login
- Logout
- Login again
- Try placing order

#### Issue 3: Backend not responding
**Solution:** Restart backend server
```bash
cd backend
npm run dev
```

#### Issue 4: CORS error
**Solution:** Check backend CORS configuration
- Backend should allow requests from http://localhost:3000

#### Issue 5: Database error
**Solution:** Check database file exists
```bash
# Check if smart_farming.db exists in backend folder
ls backend/smart_farming.db
```

### Detailed Debugging Steps

1. **Check if you're logged in**
   - Look for user info in navbar
   - If not logged in, login first

2. **Check cart has items**
   - Go to Cart page
   - Verify items are showing
   - If empty, add items from Shop

3. **Check browser console logs**
   - Open DevTools Console
   - Look for these logs when placing order:
     - "=== CHECKOUT FORM SUBMISSION ==="
     - "Form validation passed"
     - "Sending order to API:"
     - "API Response:"
     - "Order created successfully:"

4. **Check backend logs**
   - Look at terminal where backend is running
   - Should see:
     - "=== ORDER CREATION START ==="
     - "Fetching cart items..."
     - "Creating order in database..."
     - "=== ORDER CREATION SUCCESS ==="

5. **Check Network request**
   - DevTools > Network tab
   - Look for POST request to `/api/orders`
   - Check:
     - Status code (should be 201)
     - Request payload
     - Response data

### Error Messages & Solutions

| Error Message | Solution |
|--------------|----------|
| "Your cart is empty" | Add items to cart first |
| "Failed to place order" | Check backend is running |
| "Network Error" | Check backend URL in .env |
| "401 Unauthorized" | Re-login to get new token |
| "Insufficient stock" | Product out of stock |
| "Validation error" | Fill all required fields |

### Test Order Placement

1. **Login as consumer**
   - Email: consumer@test.com
   - Password: consumer123

2. **Add items to cart**
   - Go to Shop
   - Click "Add to Cart" on any product
   - Verify cart icon shows count

3. **Go to checkout**
   - Click cart icon
   - Click "Proceed to Checkout"

4. **Fill form**
   - Name: Test User
   - Email: test@example.com
   - Phone: +233501234567
   - Address: 123 Test Street
   - City: Accra
   - Region: Greater Accra
   - Payment: Cash on Delivery

5. **Place order**
   - Click "Place Order"
   - Should see success message
   - Should redirect to Orders page

### Still Not Working?

**Provide these details:**
1. Error message from browser console
2. Error message from backend logs
3. Network request status code
4. Screenshot of the error

**Quick Fix - Restart Everything:**
```bash
# Stop both servers (Ctrl+C)

# Restart backend
cd backend
npm run dev

# In new terminal, restart frontend
cd frontend
npm run dev
```

### Backend Server Check

Run this to verify backend is working:
```bash
# Test if backend is responding
curl http://localhost:5000/api/products

# Should return JSON with products
```

### Frontend Environment Check

Check `frontend/.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

Make sure this matches your backend URL.
