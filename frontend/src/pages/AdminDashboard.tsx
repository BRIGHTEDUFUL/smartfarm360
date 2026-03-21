import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { productsAPI, usersAPI, auditAPI, ordersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock_quantity: number;
  status: string;
  farmer_id: number;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  status: string;
  created_at: string;
}

interface AuditLog {
  id: number;
  user_id: number;
  admin_name: string;
  action_type: string;
  entity_type: string;
  entity_id: number;
  details: any;
  ip_address: string;
  created_at: string;
}

interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  status: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users' | 'audit'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  // User management state
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState<UserFormData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    role: 'Consumer',
    status: 'Active'
  });
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [userStatusFilter, setUserStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    pendingProducts: 0,
    activeProducts: 0,
  });

  useEffect(() => {
    if (user?.role === 'Admin') {
      loadDashboardData();
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'users' && user?.role === 'Admin') {
      loadUsers();
    }
  }, [activeTab, userSearch, userRoleFilter, userStatusFilter]);

  useEffect(() => {
    if (activeTab === 'orders' && user?.role === 'Admin') {
      loadOrders();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'audit' && user?.role === 'Admin') {
      loadAuditLogs();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadProducts(), loadStats()]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll({});
      const productsData = Array.isArray(response.data.data) 
        ? response.data.data 
        : response.data.data?.products || [];
      setProducts(productsData);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const loadStats = async () => {
    try {
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        productsAPI.getAll({}),
        usersAPI.getAll({}),
        ordersAPI.getAll()
      ]);
      
      const productsData = Array.isArray(productsRes.data.data) 
        ? productsRes.data.data 
        : productsRes.data.data?.products || [];
      
      const usersData = usersRes.data.data?.users || [];
      const ordersData = ordersRes.data.data || [];
      
      setStats({
        totalProducts: productsData.length,
        totalUsers: usersData.length,
        totalOrders: ordersData.length,
        pendingOrders: ordersData.filter((o: any) => o.status === 'Pending Payment').length,
        pendingProducts: productsData.filter((p: Product) => p.status === 'Pending').length,
        activeProducts: productsData.filter((p: Product) => p.status === 'Active').length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (userSearch) params.search = userSearch;
      if (userRoleFilter !== 'All') params.role = userRoleFilter;
      if (userStatusFilter !== 'All') params.status = userStatusFilter;

      const response = await usersAPI.getAll(params);
      setUsers(response.data.data.users || []);
    } catch (error: any) {
      toast.error('Failed to load users');
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const response = await auditAPI.getAll({});
      setAuditLogs(response.data.data.logs || []);
    } catch (error: any) {
      toast.error('Failed to load audit logs');
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
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

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await ordersAPI.updateStatus(orderId, status);
      toast.success(`Order status updated to ${status}`);
      loadOrders();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to update order status');
    }
  };

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  // Product handlers
  const handleApproveProduct = async (productId: number) => {
    try {
      await productsAPI.approve(productId);
      toast.success('Product approved successfully');
      loadProducts();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to approve product');
    }
  };

  const handleRejectProduct = async (productId: number) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await productsAPI.reject(productId, reason);
      toast.success('Product rejected');
      loadProducts();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to reject product');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productsAPI.delete(productId);
      toast.success('Product deleted successfully');
      loadProducts();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to delete product');
    }
  };

  // User handlers
  const handleAddUser = () => {
    setEditingUser(null);
    setUserFormData({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      phone: '',
      role: 'Consumer',
      status: 'Active'
    });
    setShowUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: '',
      phone: user.phone,
      role: user.role,
      status: user.status
    });
    setShowUserModal(true);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      await usersAPI.delete(userId);
      toast.success('User deleted successfully');
      loadUsers();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to delete user');
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUser) {
        // Update user
        const updateData: any = {
          first_name: userFormData.first_name,
          last_name: userFormData.last_name,
          email: userFormData.email,
          phone: userFormData.phone,
          role: userFormData.role,
          status: userFormData.status
        };
        await usersAPI.update(editingUser.id, updateData);
        toast.success('User updated successfully');
      } else {
        // Create user
        await usersAPI.create(userFormData);
        toast.success('User created successfully');
      }
      setShowUserModal(false);
      loadUsers();
      loadStats();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to save user');
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

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'CREATE':
      case 'APPROVE':
        return '#2E7D32';
      case 'UPDATE':
        return '#FF9800';
      case 'DELETE':
      case 'REJECT':
        return '#C62828';
      default:
        return '#757575';
    }
  };

  if (user?.role !== 'Admin') {
    return (
      <div>
        <Navbar />
        <div className="admin-unauthorized">
          <i className="fas fa-lock"></i>
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      <div className="admin-dashboard">
        <div className="admin-container">
          <div className="admin-header">
            <div>
              <h1>🌾 Smart Farming 360 - Admin Panel</h1>
              <p>Welcome back, {user.first_name}! Manage your platform efficiently.</p>
            </div>
            <div className="header-actions">
              <button onClick={loadDashboardData} className="refresh-all-btn">
                <i className="fas fa-sync-alt"></i>
                Refresh All
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#4CAF50' }}>
                <i className="fas fa-box"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.totalProducts}</h3>
                <p>Total Products</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#2196F3' }}>
                <i className="fas fa-shopping-cart"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.totalOrders}</h3>
                <p>Total Orders</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#FF9800' }}>
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.pendingOrders}</h3>
                <p>Pending Orders</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#9C27B0' }}>
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.totalUsers}</h3>
                <p>Total Users</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="admin-tabs">
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="fas fa-chart-line"></i>
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <i className="fas fa-box"></i>
              Products
            </button>
            <button
              className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <i className="fas fa-shopping-cart"></i>
              Orders
              {stats.pendingOrders > 0 && (
                <span className="tab-badge">{stats.pendingOrders}</span>
              )}
            </button>
            <button
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <i className="fas fa-users"></i>
              Users
            </button>
            <button
              className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
              onClick={() => setActiveTab('audit')}
            >
              <i className="fas fa-history"></i>
              Audit Logs
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-section">
                <h2>Platform Overview</h2>
                <div className="overview-grid">
                  <div className="overview-card">
                    <h3>Recent Activity</h3>
                    <p>Monitor recent platform activities and user interactions</p>
                    <div className="activity-list">
                      <div className="activity-item">
                        <i className="fas fa-plus-circle"></i>
                        <span>{stats.pendingProducts} products awaiting approval</span>
                      </div>
                      <div className="activity-item">
                        <i className="fas fa-check-circle"></i>
                        <span>{stats.activeProducts} products currently active</span>
                      </div>
                      <div className="activity-item">
                        <i className="fas fa-users"></i>
                        <span>{stats.totalUsers} registered users</span>
                      </div>
                    </div>
                  </div>

                  <div className="overview-card">
                    <h3>Quick Actions</h3>
                    <div className="quick-actions">
                      <button onClick={() => setActiveTab('products')} className="action-btn">
                        <i className="fas fa-box"></i>
                        Manage Products
                      </button>
                      <button onClick={() => setActiveTab('users')} className="action-btn">
                        <i className="fas fa-users"></i>
                        Manage Users
                      </button>
                      <button onClick={() => setActiveTab('audit')} className="action-btn">
                        <i className="fas fa-history"></i>
                        View Audit Logs
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="products-section">
                <div className="section-header">
                  <h2>Product Management</h2>
                  <button onClick={loadProducts} className="refresh-btn">
                    <i className="fas fa-sync-alt"></i>
                    Refresh
                  </button>
                </div>

                {loading ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading products...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-box-open"></i>
                    <p>No products found</p>
                  </div>
                ) : (
                  <div className="products-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Status</th>
                          <th>Farmer ID</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>GH₵ {product.price.toFixed(2)}</td>
                            <td>{product.stock_quantity}</td>
                            <td>
                              <span className={`status-badge status-${product.status.toLowerCase()}`}>
                                {product.status}
                              </span>
                            </td>
                            <td>#{product.farmer_id}</td>
                            <td>
                              <div className="action-buttons">
                                {product.status === 'Pending' && (
                                  <>
                                    <button
                                      onClick={() => handleApproveProduct(product.id)}
                                      className="btn-approve"
                                      title="Approve"
                                    >
                                      <i className="fas fa-check"></i>
                                    </button>
                                    <button
                                      onClick={() => handleRejectProduct(product.id)}
                                      className="btn-reject"
                                      title="Reject"
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="btn-delete"
                                  title="Delete"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
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

            {activeTab === 'orders' && (
              <div className="orders-section">
                <div className="section-header">
                  <h2>Order Management</h2>
                  <button onClick={loadOrders} className="refresh-btn">
                    <i className="fas fa-sync-alt"></i>
                    Refresh
                  </button>
                </div>

                {loading ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-shopping-cart"></i>
                    <p>No orders found</p>
                  </div>
                ) : (
                  <div className="orders-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Total Amount</th>
                          <th>Payment Method</th>
                          <th>Delivery Address</th>
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
                            <td>{order.delivery_address || 'N/A'}</td>
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
                                  <>
                                    <button
                                      onClick={() => handleUpdateOrderStatus(order.id, 'Processing')}
                                      className="btn-approve"
                                      title="Confirm Payment"
                                    >
                                      <i className="fas fa-check"></i>
                                    </button>
                                    <button
                                      onClick={() => handleUpdateOrderStatus(order.id, 'Cancelled')}
                                      className="btn-reject"
                                      title="Cancel"
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                  </>
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

            {activeTab === 'users' && (
              <div className="users-section">
                <div className="section-header">
                  <h2>User Management</h2>
                  <button onClick={handleAddUser} className="add-btn">
                    <i className="fas fa-plus"></i>
                    Add User
                  </button>
                </div>

                {/* Filters */}
                <div className="filters-row">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="search-input"
                  />
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="All">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Farmer">Farmer</option>
                    <option value="Consumer">Consumer</option>
                  </select>
                  <select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                {loading ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading users...</p>
                  </div>
                ) : users.length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-users"></i>
                    <p>No users found</p>
                  </div>
                ) : (
                  <div className="users-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Registered</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.first_name} {u.last_name}</td>
                            <td>{u.email}</td>
                            <td>{u.phone}</td>
                            <td>
                              <span className={`role-badge role-${u.role.toLowerCase()}`}>
                                {u.role}
                              </span>
                            </td>
                            <td>
                              <span className={`status-badge status-${u.status.toLowerCase()}`}>
                                {u.status}
                              </span>
                            </td>
                            <td>{formatDate(u.created_at)}</td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  onClick={() => handleEditUser(u)}
                                  className="btn-edit"
                                  title="Edit"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="btn-delete"
                                  title="Delete"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
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

            {activeTab === 'audit' && (
              <div className="audit-section">
                <div className="section-header">
                  <h2>Audit Logs</h2>
                  <button onClick={loadAuditLogs} className="refresh-btn">
                    <i className="fas fa-sync-alt"></i>
                    Refresh
                  </button>
                </div>

                {loading ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading audit logs...</p>
                  </div>
                ) : auditLogs.length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-history"></i>
                    <p>No audit logs found</p>
                  </div>
                ) : (
                  <div className="audit-logs-list">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="audit-log-item">
                        <div className="audit-icon" style={{ background: getActionColor(log.action_type) }}>
                          <i className={`fas fa-${
                            log.action_type === 'CREATE' ? 'plus' :
                            log.action_type === 'UPDATE' ? 'edit' :
                            log.action_type === 'DELETE' ? 'trash' :
                            log.action_type === 'APPROVE' ? 'check' :
                            log.action_type === 'REJECT' ? 'times' : 'circle'
                          }`}></i>
                        </div>
                        <div className="audit-content">
                          <div className="audit-header">
                            <span className="audit-admin">{log.admin_name || 'Unknown Admin'}</span>
                            <span className="audit-action" style={{ color: getActionColor(log.action_type) }}>
                              {log.action_type}
                            </span>
                            <span className="audit-entity">{log.entity_type}</span>
                          </div>
                          <div className="audit-details">
                            {log.details?.name && <span>Name: {log.details.name}</span>}
                            {log.details?.email && <span>Email: {log.details.email}</span>}
                            {log.details?.reason && <span>Reason: {log.details.reason}</span>}
                          </div>
                          <div className="audit-meta">
                            <span className="audit-time">
                              <i className="fas fa-clock"></i>
                              {formatTimestamp(log.created_at)}
                            </span>
                            <span className="audit-ip">
                              <i className="fas fa-network-wired"></i>
                              {log.ip_address}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button onClick={() => setShowUserModal(false)} className="modal-close">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleUserSubmit} className="user-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={userFormData.first_name}
                    onChange={(e) => setUserFormData({ ...userFormData, first_name: e.target.value })}
                    required
                    placeholder="John"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    value={userFormData.last_name}
                    onChange={(e) => setUserFormData({ ...userFormData, last_name: e.target.value })}
                    required
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  required
                  placeholder="john@example.com"
                />
              </div>

              {!editingUser && (
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    required
                    minLength={8}
                    placeholder="Min 8 characters"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  value={userFormData.phone}
                  onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                  required
                  placeholder="0241234567"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                    required
                  >
                    <option value="Consumer">Consumer</option>
                    <option value="Farmer">Farmer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={userFormData.status}
                    onChange={(e) => setUserFormData({ ...userFormData, status: e.target.value })}
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowUserModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  <i className="fas fa-save"></i>
                  {editingUser ? 'Update User' : 'Create User'}
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
                  <>
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
                    <button
                      onClick={() => {
                        handleUpdateOrderStatus(selectedOrder.id, 'Cancelled');
                        setShowOrderModal(false);
                      }}
                      className="btn-cancel"
                    >
                      <i className="fas fa-times"></i>
                      Cancel Order
                    </button>
                  </>
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

export default AdminDashboard;
