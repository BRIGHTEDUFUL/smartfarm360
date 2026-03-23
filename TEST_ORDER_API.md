# Test Order API

## Quick Backend Test

Open a new terminal and run:

```bash
# Test if backend is responding
curl http://localhost:5000/api/products

# Should return JSON with products
```

## Test Order Placement

1. **Login first** to get a token:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"consumer@test.com\",\"password\":\"consumer123\"}"
```

Copy the `accessToken` from the response.

2. **Add item to cart**:
```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{\"product_id\":1,\"quantity\":2}"
```

3. **Place order**:
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{\"payment_method\":\"Cash on Delivery\",\"delivery_method\":\"Home Delivery\",\"delivery_address\":\"123 Test St, Accra\"}"
```

## What to Look For

- If you get a 401 error: Token expired, login again
- If you get a 400 error: Check the error message in the response
- If you get a 500 error: Check backend terminal for stack trace
- If connection refused: Backend not running

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Cart is empty" | No items in cart | Add items first |
| "Insufficient stock" | Product out of stock | Check product stock |
| "CHECK constraint failed" | Invalid status value | Database schema issue |
| "Network Error" | Backend not running | Start backend |
