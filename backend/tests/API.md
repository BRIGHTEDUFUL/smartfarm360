# Smart Farming 360 API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Test Accounts
- **Admin**: admin@smartfarming.com / admin123
- **Farmer**: farmer1@test.com / farmer123
- **Consumer**: consumer@test.com / consumer123

---

## Auth Endpoints

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+233501234567",
  "role": "Consumer" // or "Farmer"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "<refresh_token>"
}
```

### Logout
```http
POST /auth/logout
Content-Type: application/json

{
  "refreshToken": "<refresh_token>"
}
```

---

## Product Endpoints

### Get All Products (Public)
```http
GET /products?status=Active&category=Vegetables&search=tomato&limit=20&offset=0
```

### Get Product by ID (Public)
```http
GET /products/:id
```

### Create Product (Farmer only)
```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Fresh Tomatoes",
  "description": "Organic red tomatoes",
  "category": "Vegetables",
  "price": 15.00,
  "unit": "kg",
  "stock_quantity": 100
}
```

### Update Product (Farmer/Admin)
```http
PUT /products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 18.00,
  "stock_quantity": 150
}
```

### Delete Product (Farmer/Admin)
```http
DELETE /products/:id
Authorization: Bearer <token>
```

### Approve Product (Admin only)
```http
PUT /products/:id/approve
Authorization: Bearer <token>
```

### Reject Product (Admin only)
```http
PUT /products/:id/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Product does not meet quality standards"
}
```

---

## Cart Endpoints (Authenticated)

### Get Cart
```http
GET /cart
Authorization: Bearer <token>
```

### Add to Cart
```http
POST /cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}
```

### Update Cart Item
```http
PUT /cart/:productId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

### Remove from Cart
```http
DELETE /cart/:productId
Authorization: Bearer <token>
```

### Clear Cart
```http
DELETE /cart
Authorization: Bearer <token>
```

---

## Order Endpoints (Authenticated)

### Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "payment_method": "MobileMoney", // or "Card", "CashOnDelivery"
  "delivery_method": "HomeDelivery", // or "Pickup"
  "delivery_address_id": 1, // required for HomeDelivery
  "pickup_location": "Main Market" // required for Pickup
}
```

### Get All Orders
```http
GET /orders
Authorization: Bearer <token>
```

### Get Order by ID
```http
GET /orders/:id
Authorization: Bearer <token>
```

### Update Order Status (Farmer/Admin)
```http
PUT /orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Processing" // Pending, Processing, Shipped, Delivered, Cancelled
}
```

### Cancel Order
```http
PUT /orders/:id/cancel
Authorization: Bearer <token>
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": [ ... ] // optional
  }
}
```

## Error Codes
- `VALIDATION_FAILED` - Input validation failed
- `DUPLICATE_EMAIL` - Email already registered
- `INVALID_CREDENTIALS` - Invalid email or password
- `ACCOUNT_INACTIVE` - Account is inactive
- `TOKEN_INVALID` - Invalid or expired token
- `MISSING_TOKEN` - Authentication token required
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `BAD_REQUEST` - Invalid request
- `INTERNAL_SERVER_ERROR` - Server error
