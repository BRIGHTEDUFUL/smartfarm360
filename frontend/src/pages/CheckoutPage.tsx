import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';
import { toast } from 'react-toastify';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
    customer_email: user?.email || '',
    customer_phone: user?.phone || '',
    delivery_address: '',
    delivery_city: '',
    delivery_region: '',
    payment_method: 'Cash on Delivery',
    notes: ''
  });

  const ghanaRegions = [
    'Greater Accra', 'Ashanti', 'Northern', 'Central', 'Western',
    'Eastern', 'Volta', 'Bono', 'Upper East', 'Upper West',
    'Ahafo', 'Oti', 'North East', 'Savannah', 'Western North', 'Bono East'
  ];

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== CHECKOUT FORM SUBMISSION ===');
    console.log('Form Data:', formData);
    console.log('Cart Items:', items.length);
    console.log('Cart Total:', total);
    
    // Prevent duplicate submissions
    if (loading) {
      console.log('Already processing, ignoring duplicate submission');
      return;
    }
    
    setLoading(true);

    try {
      // Validate form data
      if (!formData.customer_name.trim()) {
        toast.error('Please enter your full name');
        setLoading(false);
        return;
      }

      if (!formData.customer_email.trim()) {
        toast.error('Please enter your email address');
        setLoading(false);
        return;
      }

      if (!formData.customer_phone.trim()) {
        toast.error('Please enter your phone number');
        setLoading(false);
        return;
      }

      if (!formData.delivery_address.trim()) {
        toast.error('Please enter your delivery address');
        setLoading(false);
        return;
      }

      if (!formData.delivery_city.trim()) {
        toast.error('Please enter your city');
        setLoading(false);
        return;
      }

      if (!formData.delivery_region) {
        toast.error('Please select your region');
        setLoading(false);
        return;
      }

      console.log('Form validation passed');

      // Create order in database with "Pending Payment" status
      const orderData = {
        payment_method: formData.payment_method,
        delivery_method: 'Home Delivery',
        delivery_address: `${formData.delivery_address}, ${formData.delivery_city}, ${formData.delivery_region}`,
        notes: formData.notes
      };

      console.log('Sending order to API:', orderData);
      const response = await ordersAPI.create(orderData);
      console.log('API Response:', response);
      
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to create order');
      }
      
      const order = response.data.data;
      console.log('Order created successfully:', order);

      // Send order details to Formspree for admin notification
      try {
        console.log('Sending email notification...');
        await sendOrderToFormspree(order);
        console.log('Email notification sent successfully');
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the order if email fails
        toast.warning('Order created but email notification may have failed');
      }

      // Clear cart
      console.log('Clearing cart...');
      clearCart();

      // Show success message
      toast.success('Order placed successfully! Admin will contact you for payment confirmation.');

      // Redirect to orders page
      console.log('Redirecting to orders page...');
      navigate('/orders');
    } catch (error: any) {
      console.error('=== CHECKOUT ERROR ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error message:', error.message);
      
      // Handle specific error cases
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.message;
      const errorCode = error.response?.data?.error?.code;

      console.log('Error Code:', errorCode);
      console.log('Error Message:', errorMessage);

      if (errorCode === 'EMPTY_CART') {
        toast.error('Your cart is empty. Please add items before placing an order.');
        navigate('/shop');
      } else if (errorCode === 'INSUFFICIENT_STOCK') {
        toast.error(errorMessage || 'Some items are out of stock');
      } else if (errorCode === 'VALIDATION_ERROR') {
        toast.error(errorMessage || 'Please fill in all required fields');
      } else if (errorCode === 'DATABASE_ERROR') {
        toast.error('System error. Please contact support.');
      } else if (error.message === 'Network Error') {
        toast.error('Cannot connect to server. Please check if the backend is running.');
      } else {
        // Show the actual error message from backend
        const displayMessage = errorMessage || error.message || 'Failed to place order. Please try again.';
        toast.error(displayMessage);
        console.error('Full error for debugging:', JSON.stringify(error, null, 2));
      }
    } finally {
      setLoading(false);
      console.log('=== CHECKOUT PROCESS COMPLETE ===');
    }
  };

  const sendOrderToFormspree = async (order: any) => {
    try {
      const orderDetails = items.map(item => 
        `${item.name} - Quantity: ${item.quantity} - Price: GH₵ ${item.price.toFixed(2)}`
      ).join('\n');

      const formspreeData = {
        _subject: `🛒 New Order #${order.id} - Smart Farming 360`,
        order_id: order.id,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        delivery_address: `${formData.delivery_address}, ${formData.delivery_city}, ${formData.delivery_region}`,
        payment_method: formData.payment_method,
        total_amount: `GH₵ ${total.toFixed(2)}`,
        order_items: orderDetails,
        notes: formData.notes || 'No additional notes',
        order_status: 'Pending Payment',
        order_date: new Date().toLocaleString('en-GB', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        _replyto: formData.customer_email,
        _next: `${window.location.origin}/orders`
      };

      const response = await fetch('https://formspree.io/f/myknlygk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formspreeData)
      });

      if (!response.ok) {
        console.warn('Formspree notification failed, but order was created');
      }
    } catch (error) {
      console.error('Failed to send order notification:', error);
      // Don't throw error - order is already created
      toast.warning('Order created but email notification may have failed. Admin will still see the order.');
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <Navbar />
      
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-header">
            <h1>Checkout</h1>
            <p>Complete your order - Admin will contact you for payment</p>
          </div>

          <div className="checkout-layout">
            {/* Order Summary */}
            <div className="order-summary-section">
              <div className="summary-card">
                <h2>Order Summary</h2>
                
                <div className="summary-items">
                  {items.map((item) => (
                    <div key={item.product_id} className="summary-item">
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        GH₵ {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="summary-totals">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <strong>GH₵ {total.toFixed(2)}</strong>
                  </div>
                  <div className="total-row">
                    <span>Delivery Fee:</span>
                    <strong>GH₵ 0.00</strong>
                  </div>
                  <div className="total-row grand-total">
                    <span>Total:</span>
                    <strong>GH₵ {total.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="payment-notice">
                  <i className="fas fa-info-circle"></i>
                  <div>
                    <strong>Payment on Delivery</strong>
                    <p>Our admin will contact you to confirm your order and arrange payment.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="checkout-form-section">
              <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-section">
                  <h3>Contact Information</h3>
                  
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      required
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={formData.customer_email}
                        onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                        required
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone *</label>
                      <input
                        type="tel"
                        value={formData.customer_phone}
                        onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                        required
                        placeholder="+233 50 123 4567"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Delivery Address</h3>
                  
                  <div className="form-group">
                    <label>Street Address *</label>
                    <input
                      type="text"
                      value={formData.delivery_address}
                      onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                      required
                      placeholder="House number and street name"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        value={formData.delivery_city}
                        onChange={(e) => setFormData({ ...formData, delivery_city: e.target.value })}
                        required
                        placeholder="Accra"
                      />
                    </div>

                    <div className="form-group">
                      <label>Region *</label>
                      <select
                        value={formData.delivery_region}
                        onChange={(e) => setFormData({ ...formData, delivery_region: e.target.value })}
                        required
                      >
                        <option value="">Select Region</option>
                        {ghanaRegions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Payment Method</h3>
                  
                  <div className="payment-options">
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="payment_method"
                        value="Cash on Delivery"
                        checked={formData.payment_method === 'Cash on Delivery'}
                        onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      />
                      <div className="option-content">
                        <i className="fas fa-money-bill-wave"></i>
                        <div>
                          <strong>Cash on Delivery</strong>
                          <p>Pay when you receive your order</p>
                        </div>
                      </div>
                    </label>

                    <label className="payment-option">
                      <input
                        type="radio"
                        name="payment_method"
                        value="Mobile Money"
                        checked={formData.payment_method === 'Mobile Money'}
                        onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      />
                      <div className="option-content">
                        <i className="fas fa-mobile-alt"></i>
                        <div>
                          <strong>Mobile Money</strong>
                          <p>MTN, Vodafone, AirtelTigo</p>
                        </div>
                      </div>
                    </label>

                    <label className="payment-option">
                      <input
                        type="radio"
                        name="payment_method"
                        value="Bank Transfer"
                        checked={formData.payment_method === 'Bank Transfer'}
                        onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      />
                      <div className="option-content">
                        <i className="fas fa-university"></i>
                        <div>
                          <strong>Bank Transfer</strong>
                          <p>Direct bank deposit</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Additional Notes (Optional)</h3>
                  
                  <div className="form-group">
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any special instructions for delivery..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => navigate('/cart')}
                    className="btn-back"
                    disabled={loading}
                  >
                    <i className="fas fa-arrow-left"></i>
                    Back to Cart
                  </button>
                  <button
                    type="submit"
                    className="btn-place-order"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="btn-spinner"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check-circle"></i>
                        Place Order
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
