import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';
import { toast } from 'react-toastify';
import './OrdersPage.css';

interface Order {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
}

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersAPI.getAll();
      const ordersData = response.data.data || [];
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#FF9800';
      case 'processing':
        return '#2196F3';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  return (
    <div>
      <Navbar />
      
      <div className="orders-page">
        <div className="orders-container">
          <div className="orders-header">
            <div>
              <h1>My Orders</h1>
              <p>Track and manage your orders</p>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-shopping-bag"></i>
              <h3>No orders yet</h3>
              <p>Start shopping to see your orders here!</p>
              <a href="/shop" className="btn-shop">
                <i className="fas fa-shopping-cart"></i>
                Start Shopping
              </a>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3>Order #{order.id}</h3>
                      <p className="order-date">{formatDate(order.created_at)}</p>
                    </div>
                    <span 
                      className="order-status" 
                      style={{ background: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                  </div>
                  
                  {order.items && order.items.length > 0 ? (
                    <div className="order-items">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="order-item">
                          <span>{item.product_name || item.name}</span>
                          <span>x{item.quantity}</span>
                          <span>GH₵ {(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="order-items">
                      <p style={{ textAlign: 'center', color: 'var(--gray)', padding: '20px' }}>
                        Order items not available
                      </p>
                    </div>
                  )}

                  <div className="order-footer">
                    <div className="order-total">
                      <span>Total:</span>
                      <strong>GH₵ {order.total_amount.toFixed(2)}</strong>
                    </div>
                    {order.delivery_address && (
                      <div className="order-address">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{order.delivery_address}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
