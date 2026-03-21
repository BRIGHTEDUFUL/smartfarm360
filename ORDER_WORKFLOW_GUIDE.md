# Order Workflow & Manual Processing Guide

## Overview
Smart Farming 360 uses a manual order processing workflow where orders are created with "Pending Payment" status and sent to admin via Formspree for manual processing. This is ideal for businesses without integrated payment gateways.

---

## 🔄 Order Flow

### 1. Customer Places Order
**Location**: `/checkout`

**Process**:
1. Customer fills out checkout form with:
   - Contact information (name, email, phone)
   - Delivery address (street, city, region)
   - Payment method selection (Cash on Delivery, Mobile Money, Bank Transfer)
   - Optional notes

2. Customer clicks "Place Order"

3. System creates order with status: **"Pending Payment"**

4. Order details are sent to Formspree (admin notification)

5. Customer cart is cleared

6. Customer is redirected to `/orders` page

7. Success message: "Order placed successfully! Admin will contact you for payment confirmation."

---

### 2. Admin Receives Notification
**Channel**: Email via Formspree (https://formspree.io/f/xgvljoyv)

**Email Contains**:
- Order ID
- Customer name, email, phone
- Delivery address
- Payment method
- Total amount (GH₵)
- List of ordered items with quantities and prices
- Additional notes (if any)
- Order status: Pending Payment

**Admin Actions**:
1. Check email for new order notification
2. Contact customer via phone/email
3. Confirm order details
4. Arrange payment collection
5. Update order status in admin panel

---

### 3. Admin Processes Order
**Location**: Admin Dashboard → Orders Tab

**Order Statuses**:
- 🟡 **Pending Payment** - Initial status, awaiting payment confirmation
- 🔵 **Processing** - Payment confirmed, order being prepared
- 🟢 **Completed** - Order delivered successfully
- 🔴 **Cancelled** - Order cancelled

**Admin Workflow**:

#### Step 1: View Orders
- Navigate to Admin Dashboard
- Click "Orders" tab
- See all orders with pending badge count
- View order details in table

#### Step 2: Confirm Payment
- Contact customer
- Collect payment via chosen method:
  - Cash on Delivery: Arrange delivery
  - Mobile Money: Request transfer
  - Bank Transfer: Share account details
- Once payment received, click ✓ (Confirm Payment)
- Status changes to **"Processing"**

#### Step 3: Prepare & Deliver
- Coordinate with farmers for product collection
- Package order
- Arrange delivery
- Once delivered, click ✓✓ (Mark as Completed)
- Status changes to **"Completed"**

#### Cancel Order (if needed)
- If customer cancels or payment fails
- Click ✗ (Cancel)
- Status changes to **"Cancelled"**
- Inventory is restored automatically

---

## 📊 Admin Dashboard Features

### Orders Tab
**Features**:
- View all orders in table format
- Filter by status
- See customer details
- View order items and totals
- Update order status
- Refresh orders list

**Table Columns**:
- Order ID
- Customer (User ID)
- Total Amount (GH₵)
- Payment Method
- Delivery Address
- Status (color-coded badge)
- Date
- Actions (status update buttons)

**Action Buttons**:
- ✓ Confirm Payment (Pending → Processing)
- ✗ Cancel Order (Pending → Cancelled)
- ✓✓ Mark Completed (Processing → Completed)

---

## 💳 Payment Methods

### 1. Cash on Delivery
- Customer pays when receiving order
- Admin arranges delivery
- Payment collected by delivery person
- Most common in Ghana

### 2. Mobile Money
- MTN Mobile Money
- Vodafone Cash
- AirtelTigo Money
- Admin shares mobile money number
- Customer transfers payment
- Admin confirms receipt

### 3. Bank Transfer
- Admin shares bank account details
- Customer makes transfer
- Admin verifies payment
- Requires proof of payment

---

## 📧 Formspree Integration

### Configuration
**Endpoint**: `https://formspree.io/f/xgvljoyv`

**Form Fields Sent**:
```javascript
{
  _subject: "New Order #123 - Smart Farming 360",
  order_id: 123,
  customer_name: "John Doe",
  customer_email: "john@example.com",
  customer_phone: "+233 50 123 4567",
  delivery_address: "123 Main St, Accra, Greater Accra",
  payment_method: "Mobile Money",
  total_amount: "GH₵ 150.00",
  order_items: "Fresh Tomatoes - Quantity: 2 - Price: GH₵ 30.00\n...",
  notes: "Please deliver in the morning",
  order_status: "Pending Payment",
  _replyto: "john@example.com"
}
```

### Email Template
Admin receives formatted email with all order details for easy processing.

---

## 🔐 Security & Validation

### Order Creation
- ✅ User must be authenticated
- ✅ Cart must not be empty
- ✅ Stock availability checked
- ✅ Inventory reduced immediately
- ✅ Cart cleared after order creation

### Order Cancellation
- ✅ Only "Pending Payment" orders can be cancelled
- ✅ Inventory restored automatically
- ✅ Audit log created

### Admin Actions
- ✅ Only admins can update order status
- ✅ All actions logged in audit trail
- ✅ Status transitions validated

---

## 📱 Customer Experience

### Order Placement
1. Add items to cart
2. Click "Proceed to Checkout"
3. Fill delivery & contact info
4. Select payment method
5. Add optional notes
6. Click "Place Order"
7. See success message
8. Receive order confirmation

### Order Tracking
- View orders at `/orders`
- See order status
- View order details
- Track order progress

### Status Meanings for Customers
- **Pending Payment**: Admin will contact you soon
- **Processing**: Payment confirmed, order being prepared
- **Completed**: Order delivered successfully
- **Cancelled**: Order was cancelled

---

## 🎯 Best Practices

### For Admins
1. **Check emails regularly** for new orders
2. **Contact customers promptly** (within 24 hours)
3. **Confirm payment** before processing
4. **Update status** as order progresses
5. **Communicate** with customers throughout
6. **Keep records** of all transactions

### For Customers
1. **Provide accurate** contact information
2. **Be available** for admin contact
3. **Prepare payment** as per chosen method
4. **Confirm delivery** address
5. **Add notes** for special instructions

---

## 🔧 Technical Details

### Database Schema
```sql
orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  total_amount DECIMAL,
  payment_method TEXT,
  delivery_method TEXT,
  delivery_address TEXT,
  notes TEXT,
  status TEXT DEFAULT 'Pending Payment',
  created_at TIMESTAMP
)
```

### API Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (admin/user specific)
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (admin only)
- `PUT /api/orders/:id/cancel` - Cancel order

### Status Flow
```
Pending Payment → Processing → Completed
       ↓
   Cancelled
```

---

## 📈 Future Enhancements

### Potential Additions
1. **SMS Notifications** - Alert customers of status changes
2. **Payment Gateway Integration** - MTN Mobile Money API, Paystack
3. **Delivery Tracking** - Real-time delivery updates
4. **Invoice Generation** - PDF invoices for orders
5. **Order History** - Detailed order analytics
6. **Customer Reviews** - Post-delivery feedback
7. **Automated Emails** - Status change notifications

---

## 🆘 Troubleshooting

### Order Not Created
- Check cart has items
- Verify user is authenticated
- Check stock availability
- Review browser console for errors

### Email Not Received
- Check Formspree endpoint is correct
- Verify email address in Formspree settings
- Check spam folder
- Test Formspree endpoint manually

### Status Not Updating
- Verify admin permissions
- Check network connection
- Refresh page
- Check browser console

### Inventory Issues
- Orders reduce inventory immediately
- Cancelled orders restore inventory
- Check product stock levels
- Review order items

---

## 📞 Support

For technical issues or questions:
- Check this guide first
- Review error messages
- Contact system administrator
- Email: support@smartfarming360.com

---

## ✅ Checklist

### Order Processing Checklist
- [ ] Receive email notification
- [ ] Contact customer
- [ ] Confirm order details
- [ ] Collect payment
- [ ] Update status to "Processing"
- [ ] Coordinate with farmers
- [ ] Package order
- [ ] Arrange delivery
- [ ] Deliver order
- [ ] Update status to "Completed"
- [ ] Follow up with customer

---

**Last Updated**: 2024
**Version**: 1.0
**Status**: ✅ Production Ready
