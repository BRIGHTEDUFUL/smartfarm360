import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import './ShopPage.css';
import './ShopPage.enhanced.css';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  stock_quantity: number;
  status: string;
  farmer_id: number;
}

const categories = [
  { name: 'All Products', icon: '🌾', value: '' },
  { name: 'Vegetables', icon: '🥬', value: 'Vegetables' },
  { name: 'Fruits', icon: '🍎', value: 'Fruits' },
  { name: 'Grains', icon: '🌾', value: 'Grains' },
  { name: 'Poultry', icon: '🐔', value: 'Poultry' },
  { name: 'Meat', icon: '🥩', value: 'Meat' },
  { name: 'Dairy', icon: '🥛', value: 'Dairy' },
  { name: 'Spices', icon: '🌶️', value: 'Spices' },
];

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Keep all products for counting
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, _setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const productsGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy]);

  // Scroll animation observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animate-on-scroll');
          }, index * 50);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe product cards
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = { status: 'Active' };
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      
      const response = await productsAPI.getAll(params);
      console.log('Products API response:', response.data);
      
      // Handle both array and object response formats
      const productsData = Array.isArray(response.data.data) 
        ? response.data.data 
        : response.data.data?.products || [];
      
      setProducts(productsData);
      
      // Fetch all products for category counts if not already fetched
      if (allProducts.length === 0) {
        const allResponse = await productsAPI.getAll({ status: 'Active' });
        const allProductsData = Array.isArray(allResponse.data.data) 
          ? allResponse.data.data 
          : allResponse.data.data?.products || [];
        setAllProducts(allProductsData);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: number, productName: string) => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(productId, 1);
      toast.success(`${productName} added to cart!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const getImagePath = (productName: string) => {
    const imageMap: { [key: string]: string } = {
      // Vegetables
      'Fresh Tomatoes': '/images/tomato.jpg',
      'Garden Eggs': '/images/eggplant.jpg',
      'Fresh Carrots': '/images/carrot.jpg',
      'Fresh Onions': '/images/Onions.jpg',
      'Fresh Okra': '/images/okra.jpg',
      
      // Fruits
      'Ripe Bananas': '/images/banana.jpg',
      'Fresh Pineapples': '/images/pineapple.jpg',
      'Watermelon': '/images/watermelon.jpg',
      'Fresh Avocado': '/images/avocado.jpg',
      'Ripe Mangoes': '/images/mango.webp',
      
      // Grains & Cereals
      'Sweet Corn': '/images/maize.jpg',
      'Premium Rice': '/images/rice.jpg',
      'Brown Beans': '/images/BEANS.jpg',
      'Pearl Millets': '/images/Millets.webp',
      
      // Tubers & Roots
      'Fresh Cassava': '/images/casasava.jpg',
      'White Yam': '/images/yam.jpg',
      'Cocoyam': '/images/cocoyam.jpg',
      'Sweet Potatoes': '/images/sweet potatoes.jpeg',
      
      // Poultry & Eggs
      'Free Range Eggs': '/images/eggs.jpg',
      'Whole Chicken': '/images/chicken.jpg',
      'Duck Meat': '/images/Duck.jpg',
      'Turkey': '/images/turkey.webp',
      
      // Meat
      'Fresh Beef': '/images/beef.jpg',
      'Pork Meat': '/images/pork.jpg',
      'Goat Meat': '/images/goats.webp',
      'Fresh Fish': '/images/fish.jpg',
      'Snail Meat': '/images/Snail.jpg',
      'Rabbit Meat': '/images/rabbit.jpg',
      
      // Dairy
      'Fresh Milk': '/images/milk.jpg',
      
      // Spices & Condiments
      'Hot Pepper': '/images/pepper.jpg',
      'Fresh Chilli': '/images/chilli.jpg',
      'Fresh Ginger': '/images/ginger.jpg',
      'Raw Honey': '/images/honey.jpg',
      'Shito Pepper': '/images/Shito.jpeg',
      'Prekese Spice': '/images/Prekese.jpeg',
    };

    return imageMap[productName] || '/images/vegitales.jpg';
  };

  const getBadge = (category: string) => {
    const badges: { [key: string]: { text: string; class: string } } = {
      'Vegetables': { text: 'Fresh', class: 'badge-fresh' },
      'Fruits': { text: 'Organic', class: 'badge-organic' },
      'Grains': { text: 'Staple', class: 'badge-staple' },
      'Poultry': { text: 'Protein', class: 'badge-protein' },
      'Meat': { text: 'Premium', class: 'badge-premium' },
      'Dairy': { text: 'Fresh', class: 'badge-fresh' },
      'Spices': { text: 'Hot', class: 'badge-hot' },
    };

    return badges[category] || { text: 'New', class: 'badge-bestseller' };
  };

  return (
    <div>
      <Navbar />

      {/* Hero Banner */}
      <div className="shop-hero">
        <div className="hero-bg-anim">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>

        <div className="shop-hero-inner">
          <div className="shop-hero-text">
            <div className="hero-eyebrow">
              <i className="fas fa-leaf"></i>
              <span>Farm Fresh Direct to You</span>
            </div>
            <h1>
              <span className="static">Fresh from Ghana's</span>
              <span className="typewriter">Best Farms</span>
            </h1>
            <p>
              Connect directly with local farmers and get the freshest produce, 
              poultry, and more delivered to your doorstep. Support local agriculture 
              while enjoying premium quality products.
            </p>

            <div className="hero-trust">
              <div className="trust-badge">
                <i className="fas fa-check-circle"></i>
                <span>100% Fresh</span>
              </div>
              <div className="trust-badge">
                <i className="fas fa-truck"></i>
                <span>Fast Delivery</span>
              </div>
              <div className="trust-badge">
                <i className="fas fa-shield-alt"></i>
                <span>Quality Guaranteed</span>
              </div>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <strong>{products.length}+</strong>
                <span>Products</span>
              </div>
              <div className="hero-stat">
                <strong>50+</strong>
                <span>Farmers</span>
              </div>
              <div className="hero-stat">
                <strong>1000+</strong>
                <span>Happy Customers</span>
              </div>
            </div>
          </div>

          <div className="hero-cards-wrap">
            <div className="hero-float-card hfc-1">
              <img src="/images/tomato.jpg" alt="Tomatoes" className="hfc-img" />
              <div className="hfc-body">
                <div className="hfc-name">Fresh Tomatoes</div>
                <div className="hfc-price">GH₵ 15.00/kg</div>
                <div className="hfc-rating">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <div className="hero-float-card hfc-2">
              <img src="/images/banana.jpg" alt="Bananas" className="hfc-img" />
              <div className="hfc-body">
                <div className="hfc-name">Ripe Bananas</div>
                <div className="hfc-price">GH₵ 10.00/bunch</div>
                <div className="hfc-rating">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <div className="hero-float-card hfc-3">
              <img src="/images/eggs.jpg" alt="Eggs" className="hfc-img" />
              <div className="hfc-body">
                <div className="hfc-name">Farm Eggs</div>
                <div className="hfc-price">GH₵ 30.00/crate</div>
                <div className="hfc-rating">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <div className="hero-float-card hfc-4">
              <img src="/images/pineapple.jpg" alt="Pineapple" className="hfc-img" />
              <div className="hfc-body">
                <div className="hfc-name">Pineapples</div>
                <div className="hfc-price">GH₵ 20.00/piece</div>
                <div className="hfc-rating">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-deal-strip">
          <div className="hero-deal-inner">
            <span className="deal-label">🔥 Hot Deal</span>
            <span className="deal-text">
              Get <span>20% OFF</span> on your first order! Use code: <span>FRESH20</span>
            </span>
            <button className="deal-cta">Shop Now</button>
          </div>
        </div>

        <div className="hero-cats-strip">
          <div className="hero-cats-track">
            {[...categories, ...categories].map((cat, idx) => (
              <div
                key={idx}
                className="hero-cat-pill"
                onClick={() => setSelectedCategory(cat.value)}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Shop Layout */}
      <div className="shop-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-card">
            <div className="sidebar-title">Categories</div>
            <ul className="cat-list">
              {categories.map((cat) => (
                <li
                  key={cat.value}
                  className={`cat-item ${selectedCategory === cat.value ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  <div className="cat-icon">{cat.icon}</div>
                  <span>{cat.name}</span>
                  <span className="cat-count">
                    {cat.value === '' 
                      ? allProducts.length 
                      : allProducts.filter(p => p.category === cat.value).length}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="shop-main">
          <div className="shop-toolbar">
            <div className="results-info">
              Showing <strong>{products.length}</strong> products
            </div>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="created_at">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray)' }}>
              <i className="fas fa-box-open" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}></i>
              <p>No products found</p>
            </div>
          ) : (
            <div className="products-grid" ref={productsGridRef}>
              {products.map((product) => {
                const badge = getBadge(product.category);
                return (
                  <div key={product.id} className="product-card">
                    <div className="card-image-wrap">
                      <img
                        src={getImagePath(product.name)}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src = '/images/vegitales.jpg';
                        }}
                      />
                      <span className={`card-badge ${badge.class}`}>{badge.text}</span>
                      <button className="card-wishlist">
                        <i className="far fa-heart"></i>
                      </button>
                      <Link to={`/product/${product.id}`} className="card-quick-view">
                        Quick View
                      </Link>
                    </div>

                    <div className="card-body">
                      <div className="card-category">
                        <i className="fas fa-tag"></i>
                        {product.category}
                      </div>
                      <Link to={`/product/${product.id}`} className="card-name">
                        {product.name}
                      </Link>
                      <div className="card-farmer">
                        <i className="fas fa-user-tie"></i>
                        Farmer #{product.farmer_id}
                      </div>
                      <div className="card-rating">
                        <span className="stars">⭐⭐⭐⭐⭐</span>
                        <span className="rating-count">(24)</span>
                      </div>
                      <p className="card-desc">{product.description}</p>

                      <div className="card-footer">
                        <div className="card-price">
                          <span className="price-amount">GH₵ {product.price.toFixed(2)}</span>
                          <span className="price-unit">per {product.unit}</span>
                          <span className={`card-stock ${product.stock_quantity < 20 ? 'low' : ''}`}>
                            {product.stock_quantity} in stock
                          </span>
                        </div>
                        <button
                          className="add-cart-btn"
                          onClick={() => handleAddToCart(product.id, product.name)}
                          disabled={product.stock_quantity === 0}
                        >
                          <i className="fas fa-shopping-cart"></i>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopPage;
