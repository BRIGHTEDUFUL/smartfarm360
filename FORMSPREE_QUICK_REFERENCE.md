# Formspree Quick Reference Guide

**Endpoint**: https://formspree.io/f/myknlygk

---

## 📍 Where Forms Are Located

### 1. Newsletter Subscription
- **Page**: Homepage (footer section)
- **URL**: http://localhost:3000/
- **File**: `frontend/src/pages/HomePage.tsx`
- **Line**: ~700 (footer section)

### 2. Contact Form
- **Page**: Contact Page
- **URL**: http://localhost:3000/contact
- **File**: `frontend/src/pages/ContactPage.tsx`
- **Line**: ~50 (form section)

### 3. Order Notification
- **Page**: Checkout Page (backend notification)
- **URL**: http://localhost:3000/checkout
- **File**: `frontend/src/pages/CheckoutPage.tsx`
- **Function**: `sendOrderToFormspree()` (line ~150)

---

## 🧪 Quick Test

### Test Newsletter (30 seconds)
```
1. Go to http://localhost:3000/
2. Scroll to bottom
3. Enter: test@example.com
4. Click paper plane icon
5. Check Formspree dashboard
```

### Test Contact Form (1 minute)
```
1. Go to http://localhost:3000/contact
2. Fill:
   - Name: Test User
   - Email: test@example.com
   - Subject: General Inquiry
   - Message: This is a test
3. Click "Send Message"
4. See success banner
5. Check Formspree dashboard
```

### Test Order Notification (2 minutes)
```
1. Go to http://localhost:3000/shop
2. Add any product to cart
3. Go to checkout
4. Fill delivery details
5. Click "Place Order"
6. Check Formspree dashboard for order email
```

---

## 📧 Email Notifications

### Newsletter Subscription Email
```
Subject: Newsletter Subscription - Smart Farming 360
From: test@example.com
```

### Contact Form Email
```
Subject: Contact Form - Smart Farming 360
From: test@example.com
Fields: Name, Email, Phone, Subject, Message
```

### Order Notification Email
```
Subject: 🛒 New Order #123 - Smart Farming 360
From: customer@example.com
Fields: Order ID, Customer info, Items, Total, Address, Payment
```

---

## 🔧 Configuration

### Environment Variable
```env
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/myknlygk
```

### Files with Endpoint
- `frontend/.env`
- `frontend/.env.example`
- `frontend/.env.production`

### Hardcoded Endpoints (for reference)
- `frontend/src/pages/HomePage.tsx` (line ~700)
- `frontend/src/pages/ContactPage.tsx` (line ~50)
- `frontend/src/pages/CheckoutPage.tsx` (line ~150)

---

## 🎯 What Gets Sent

### Newsletter
- Email address
- Subject: "Newsletter Subscription - Smart Farming 360"
- Redirect URL

### Contact Form
- Name
- Email
- Phone (optional)
- Subject (dropdown selection)
- Message
- Redirect URL

### Order Notification
- Order ID
- Customer name, email, phone
- Delivery address (full)
- Payment method
- Total amount (GH₵)
- Order items (list with quantities)
- Customer notes
- Order status
- Order date/time
- Reply-to email

---

## 📊 Formspree Dashboard

**URL**: https://formspree.io/forms/myknlygk/submissions

**What You'll See**:
- All form submissions
- Timestamps
- Email addresses
- Form data
- Export options

---

## ✅ Verification

### Check if Forms Work
```bash
# 1. Start dev servers
npm run dev

# 2. Test each form
# 3. Check Formspree dashboard
# 4. Verify emails received
```

### Check Build
```bash
cd frontend
npm run build
# Should complete without errors
```

---

## 🚨 Troubleshooting

### Form doesn't submit
- Check browser console for errors
- Verify Formspree endpoint is correct
- Check network tab for failed requests

### No email received
- Check Formspree dashboard for submission
- Verify email settings in Formspree
- Check spam folder

### Redirect doesn't work
- Verify `_next` field has correct URL
- Check if URL parameter appears after submit

---

## 📱 Mobile Testing

All forms work on mobile:
- Touch-friendly inputs
- Responsive design
- Mobile keyboard optimization
- Success messages visible

---

## 🎉 Quick Summary

✅ 3 forms integrated  
✅ 1 Formspree endpoint  
✅ All emails go to your inbox  
✅ No backend email config needed  
✅ Works on all devices  
✅ Production ready  

**Just test and deploy!**

---

**Formspree Endpoint**: myknlygk  
**Last Updated**: March 24, 2026
