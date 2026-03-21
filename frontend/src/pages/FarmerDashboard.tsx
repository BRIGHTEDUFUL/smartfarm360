import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { productsAPI } from '../services/api';
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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
            <div>
              <h1>Farmer Dashboard</h1>
              <p>Welcome back, {user.first_name}! Manage your products here.</p>
            </div>
            <button onClick={() => { resetForm(); setEditingProduct(null); setShowAddModal(true); }} className="btn-add-product">
              <i className="fas fa-plus"></i>
              Add New Product
            </button>
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

          {/* Products List */}
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
    </div>
  );
};

export default FarmerDashboard;
