import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { productsAPI, ordersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import './FarmerDashboard.css';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  stock_quantity: number;
  status: string;
  farmer_id?: number;
}

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Vegetables',
    price: '',
    unit: 'kg',
    stock_quantity: '',
  });

  const categories = ['Vegetables', 'Fruits', 'Grains', 'Poultry', 'Meat', 'Dairy', 'Spices'];
  const units = ['kg', 'piece', 'bunch', 'crate', 'bag', 'liter'];

  useEffect(() => {
    if (user?.role === 'Farmer') {
      loadMyProducts();
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders' && user?.role === 'Farmer') {
      loadMyOrders();
    }
  }, [activeTab]);

  const loadMyProducts = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getAll({});
      const allProducts = Array.isArray(response.data.data) 
        ? response.data.data 
        : response.data.data?.products || [];
      
      // Filter products by current farmer
      const myProducts = allProducts.filter((p: Product) => p.farmer_id === user?.id);
      setProducts(myProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load your products');
    } finally {
      setLoading(false);
    }
  };

  const loadMyOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersAPI.getAll();
      const ordersData = response.data.data || [];
      
      // Fetch order details with items for each order
      const ordersWithDetails = await Promise.all(
        ordersData.map(async (order: any) => {
          try {
            const detailsResponse = await ordersAPI.getById(order.id);
            return detailsResponse.data.data;
          } catch (error) {
            console.error(`Failed to load details for order ${order.id}:`, error);
            return order;
          }
        })
      );
      
      setOrders(ordersWithDetails);
    } catch (error: any) {
      toast.error('Failed to load orders');
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        await productsAPI.create(productData);
        toast.success('Product created successfully! Awaiting admin approval.');
      }

      setShowAddModal(false);
      setEditingProduct(null);
      resetForm();
      loadMyProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      unit: product.unit,
      stock_quantity: product.stock_quantity.toString(),
    });
    setShowAddModal(true);
  };

  const handleDelete = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productsAPI.delete(productId);
      toast.success('Product deleted successfully');
      loadMyProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Vegetables',
      price: '',
      unit: 'kg',
      stock_quantity: '',
    });
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await ordersAPI.updateStatus(orderId, status);
      toast.success(`Order status updated to ${status}`);
      loadMyOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to update order status');
    }
  };

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'Active').length,
    pending: products.filter(p => p.status === 'Pending').length,
    rejected: products.filter(p => p.status === 'Rejected').length,
  };

  if (user?.role !== 'Farmer') {
    return (
      <div>
        <Navbar />
        <div className="farmer-unauthorized">
          <i className="fas fa-lock"></i>
          <h2>Access Denied</h2>
          <p>This page is only accessible to farmers.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      <div className="farmer-dashboard">
        <div className="farmer-container">
          <div className="farmer-header">
            <div className="header-text">
              <h1>🌾 Farmer Dashboard</h1>
              <p>Welcome back, <strong>{user.first_name}</strong>! Manage your products and grow your business.</p>
            </div>
            <div className="header-actions">
              <button onClick={loadMyProducts} className="btn-refresh">
                <i className="fas fa-sync-alt"></i>
                Refresh
              </button>
              <button onClick={() => { resetForm(); setEditingProduct(null); setShowAddModal(true); }} className="btn-add-product">
                <i className="fas fa-plus"></i>
                Add New Product
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="farmer-stats">
            <div className="stat-box">
              <div className="stat-icon" style={{ background: '#4CAF50' }}>
                <i className="fas fa-box"></i>
              </div>
              <div>
                <h3>{stats.total}</h3>
                <p>Total Products</p>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon" style={{ background: '#2196F3' }}>
                <i className="fas fa-check-circle"></i>
              </div>
              <div>
                <h3>{stats.active}</h3>
                <p>Active</p>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon" style={{ background: '#FF9800' }}>
                <i className="fas fa-clock"></i>
              </div>
              <div>
                <h3>{stats.pending}</h3>
                <p>Pending</p>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon" style={{ background: '#F44336' }}>
                <i className="fas fa-times-circle"></i>
              </div>
              <div>
                <h3>{stats.rejected}</h3>
                <p>Rejected</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="farmer-tabs">
            <button
              className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <i className="fas fa-box"></i>
              My Products
            </button>
            <button
              className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <i className="fas fa-shopping-cart"></i>
              Orders
            </button>
          </div>

          {/* Products Section */}
          {activeTab === 'products' && (
          <div className="products-section">
            <h2>My Products</h2>
            
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading your products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-box-open"></i>
                <h3>No products yet</h3>
                <p>Start by adding your first product!</p>
                <button onClick={() => setShowAddModal(true)} className="btn-add-first">
                  <i className="fas fa-plus"></i>
                  Add Your First Product
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <div key={product.id} className="product-item">
                    <div className="product-header">
                      <h3>{product.name}</h3>
                      <span className={`status-badge status-${product.status.toLowerCase()}`}>
                        {product.status}
                      </span>
                    </div>
                    <p className="product-desc">{product.description}</p>
                    <div className="product-details">
                      <div className="detail-row">
                        <span className="label">Category:</span>
                        <span>{product.category}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Price:</span>
                        <span className="price">GH₵ {product.price.toFixed(2)} / {product.unit}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Stock:</span>
                        <span>{product.stock_quantity} {product.unit}</span>
                      </div>
                    </div>
                    <div className="product-actions">
                      <button onClick={() => handleEdit(product)} className="btn-edit">
                        <i className="fas fa-edit"></i>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="btn-delete">
                        <i className="fas fa-trash"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}

          {/* Orders Section */}
          {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>My Orders</h2>
            
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-shopping-cart"></i>
                <h3>No orders yet</h3>
                <p>Orders containing your products will appear here</p>
              </div>
            ) : (
              <div className="orders-table-wrap">
                <table className="farmer-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total Amount</th>
                      <th>Payment Method</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>User #{order.user_id}</td>
                        <td>GH₵ {order.total_amount.toFixed(2)}</td>
                        <td>{order.payment_method}</td>
                        <td>
                          <span className={`status-badge status-${order.status.toLowerCase().replace(' ', '-')}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{formatDate(order.created_at)}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => handleViewOrderDetails(order)}
                              className="btn-edit"
                              title="View Details"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            {order.status === 'Pending Payment' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'Processing')}
                                className="btn-approve"
                                title="Confirm Payment"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                            )}
                            {order.status === 'Processing' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'Completed')}
                                className="btn-approve"
                                title="Mark as Completed"
                              >
                                <i className="fas fa-check-double"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowAddModal(false)} className="modal-close">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Fresh Tomatoes"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Describe your product..."
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Unit *</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    required
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (GH₵) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Stock Quantity *</label>
                  <input
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    required
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  <i className="fas fa-save"></i>
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="modal-content order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details #{selectedOrder.id}</h2>
              <button onClick={() => setShowOrderModal(false)} className="modal-close">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="order-details-content">
              <div className="detail-section">
                <h3>Order Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Order ID:</span>
                    <span className="value">#{selectedOrder.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Status:</span>
                    <span className={`status-badge status-${selectedOrder.status.toLowerCase().replace(' ', '-')}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Date:</span>
                    <span className="value">{formatDate(selectedOrder.created_at)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Payment Method:</span>
                    <span className="value">{selectedOrder.payment_method}</span>
                  </div>
                </div>
              </div>

              {selectedOrder.delivery_address && (
                <div className="detail-section">
                  <h3>Delivery Information</h3>
                  <div className="detail-item">
                    <span className="label">Address:</span>
                    <span className="value">{selectedOrder.delivery_address}</span>
                  </div>
                </div>
              )}

              {selectedOrder.notes && (
                <div className="detail-section">
                  <h3>Customer Notes</h3>
                  <p className="notes-text">{selectedOrder.notes}</p>
                </div>
              )}

              <div className="detail-section">
                <h3>Order Items</h3>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item: any, idx: number) => (
                        <tr key={idx}>
                          <td>{item.name || 'Product'}</td>
                          <td>{item.quantity}</td>
                          <td>GH₵ {item.price_at_purchase.toFixed(2)}</td>
                          <td>GH₵ {(item.price_at_purchase * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3}><strong>Total Amount:</strong></td>
                        <td><strong>GH₵ {selectedOrder.total_amount.toFixed(2)}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                ) : (
                  <p>No items found</p>
                )}
              </div>

              <div className="modal-actions">
                {selectedOrder.status === 'Pending Payment' && (
                  <button
                    onClick={() => {
                      handleUpdateOrderStatus(selectedOrder.id, 'Processing');
                      setShowOrderModal(false);
                    }}
                    className="btn-submit"
                  >
                    <i className="fas fa-check"></i>
                    Confirm Payment
                  </button>
                )}
                {selectedOrder.status === 'Processing' && (
                  <button
                    onClick={() => {
                      handleUpdateOrderStatus(selectedOrder.id, 'Completed');
                      setShowOrderModal(false);
                    }}
                    className="btn-submit"
                  >
                    <i className="fas fa-check-double"></i>
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
