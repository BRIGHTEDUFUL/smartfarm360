import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { productsAPI } from '../services/api';
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

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'users'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalFarmers: 0,
    totalConsumers: 0,
    pendingProducts: 0,
    activeProducts: 0,
  });

  useEffect(() => {
    if (user?.role === 'Admin') {
      loadDashboardData();
    }
  }, [user]);

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
      const response = await productsAPI.getAll({});
      const productsData = Array.isArray(response.data.data) 
        ? response.data.data 
        : response.data.data?.products || [];
      
      setStats({
        totalProducts: productsData.length,
        totalUsers: 0, // Would need backend endpoint
        totalFarmers: 0,
        totalConsumers: 0,
        pendingProducts: productsData.filter((p: Product) => p.status === 'Pending').length,
        activeProducts: productsData.filter((p: Product) => p.status === 'Active').length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

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
            <h1>Admin Dashboard</h1>
            <p>Manage your Smart Farming 360 platform</p>
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
              <div className="stat-icon" style={{ background: '#FF9800' }}>
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.activeProducts}</h3>
                <p>Active Products</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#F44336' }}>
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.pendingProducts}</h3>
                <p>Pending Approval</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#2196F3' }}>
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
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <i className="fas fa-users"></i>
              Users
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

            {activeTab === 'users' && (
              <div className="users-section">
                <div className="section-header">
                  <h2>User Management</h2>
                  <p>User management features coming soon</p>
                </div>
                <div className="empty-state">
                  <i className="fas fa-users"></i>
                  <p>User management interface will be available soon</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
