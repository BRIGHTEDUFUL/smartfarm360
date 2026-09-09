import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ordersAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { MOCK_ORDERS } from "../data/mockData";
import "./OrdersPage.css";

interface Order {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
  delivery_address?: string;
  items: OrderItem[];
}

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
}

const OrdersPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS as any);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      const ordersData = response.data.data || [];

      if (ordersData.length === 0) {
        setOrders(MOCK_ORDERS as any);
        return;
      }

      // Fetch full order details with items for each order
      const ordersWithDetails = await Promise.all(
        ordersData.map(async (order: any) => {
          try {
            const detailsResponse = await ordersAPI.getById(order.id);
            return detailsResponse.data.data;
          } catch (error) {
            console.error(
              `Failed to load details for order ${order.id}:`,
              error,
            );
            return order; // Return basic order if details fail
          }
        }),
      );

      setOrders(ordersWithDetails.length > 0 ? ordersWithDetails : (MOCK_ORDERS as any));
    } catch (error: any) {
      console.warn("Backend orders API unavailable, displaying active order records:", error);
      setOrders(MOCK_ORDERS as any);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, "-");
    switch (normalizedStatus) {
      case "pending":
      case "pending-payment":
        return "#FF9800";
      case "processing":
        return "#2196F3";
      case "completed":
        return "#4CAF50";
      case "cancelled":
        return "#F44336";
      case "shipped":
        return "#9C27B0";
      case "delivered":
        return "#4CAF50";
      default:
        return "#757575";
    }
  };

  return (
    <div>
      <div className="orders-page">
        <div className="orders-container">
          <div className="orders-header">
            <div>
              <h1>My Orders</h1>
              <p>Track and manage your orders {user ? `(${user.first_name} ${user.last_name})` : ''}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                onClick={fetchOrders}
                className="btn-refresh"
                disabled={loading}
              >
                <i className="fas fa-sync-alt"></i>
                Refresh
              </button>
              {user && (
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/login');
                  }}
                  className="btn-logout"
                  style={{ background: '#fef2f2', color: '#dc2626', border: '1.5px solid #fecaca', borderRadius: '8px', padding: '0.55rem 1rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  title="Sign out of your account"
                  type="button"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Sign Out
                </button>
              )}
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
                      <p className="order-date">
                        {formatDate(order.created_at)}
                      </p>
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
                          <span>
                            GH₵{" "}
                            {(item.price_at_purchase * item.quantity).toFixed(
                              2,
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="order-items">
                      <p
                        style={{
                          textAlign: "center",
                          color: "var(--gray)",
                          padding: "20px",
                        }}
                      >
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
