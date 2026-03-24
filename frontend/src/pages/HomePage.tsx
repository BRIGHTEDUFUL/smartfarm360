import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import './HomePage.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const HomePage = () => {
  const [currentRegion, setCurrentRegion] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Ghana's 16 Regional Capitals with Farm Highlights
  const ghanaRegions = [
    { capital: 'Accra', region: 'Greater Accra', highlight: 'Urban Farming & Fresh Vegetables', icon: '🥬' },
    { capital: 'Kumasi', region: 'Ashanti', highlight: 'Cocoa & Plantain Hub', icon: '🍫' },
    { capital: 'Tamale', region: 'Northern', highlight: 'Rice & Groundnut Capital', icon: '🌾' },
    { capital: 'Cape Coast', region: 'Central', highlight: 'Coconut & Cassava Farms', icon: '🥥' },
    { capital: 'Sekondi-Takoradi', region: 'Western', highlight: 'Palm Oil & Rubber Plantations', icon: '🌴' },
    { capital: 'Koforidua', region: 'Eastern', highlight: 'Pineapple & Citrus Paradise', icon: '🍍' },
    { capital: 'Ho', region: 'Volta', highlight: 'Organic Vegetables & Spices', icon: '🌶️' },
    { capital: 'Sunyani', region: 'Bono', highlight: 'Cashew & Maize Farms', icon: '🌽' },
    { capital: 'Bolgatanga', region: 'Upper East', highlight: 'Millet & Sorghum Fields', icon: '🌾' },
    { capital: 'Wa', region: 'Upper West', highlight: 'Shea Butter & Groundnuts', icon: '🥜' },
    { capital: 'Goaso', region: 'Ahafo', highlight: 'Cocoa & Coffee Estates', icon: '☕' },
    { capital: 'Dambai', region: 'Oti', highlight: 'Yam & Soybean Cultivation', icon: '🍠' },
    { capital: 'Nalerigu', region: 'North East', highlight: 'Livestock & Grain Farming', icon: '🐄' },
    { capital: 'Damongo', region: 'Savannah', highlight: 'Cashew & Shea Production', icon: '🌰' },
    { capital: 'Sefwi Wiawso', region: 'Western North', highlight: 'Cocoa & Timber Resources', icon: '🌳' },
    { capital: 'Bechem', region: 'Bono East', highlight: 'Tomato & Pepper Farms', icon: '🍅' },
  ];

  // Rotate through regions every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRegion((prev) => (prev + 1) % ghanaRegions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle PWA install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support install prompt
      alert('To install the app:\n\nChrome/Edge: Click the install icon in the address bar\niOS Safari: Tap Share → Add to Home Screen\nAndroid: Tap menu → Add to Home Screen');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('App installed');
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const features = [
    {
      icon: '🌱',
      title: 'Farm Fresh Products',
      description: 'Direct from local farmers to your doorstep. 100% fresh, organic, and sustainably grown.',
    },
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Same-day delivery available. Track your order in real-time from farm to table.',
    },
    {
      icon: '💰',
      title: 'Fair Prices',
      description: 'No middlemen. Fair prices for farmers, great value for consumers.',
    },
    {
      icon: '🛡️',
      title: 'Quality Guaranteed',
      description: 'Every product is verified for quality. 100% satisfaction guaranteed or money back.',
    },
  ];

  const categories = [
    { name: 'Vegetables', icon: '🥬', count: '50+', color: '#4CAF50' },
    { name: 'Fruits', icon: '🍎', count: '40+', color: '#FF9800' },
    { name: 'Grains', icon: '🌾', count: '30+', color: '#8D6E63' },
    { name: 'Poultry', icon: '🐔', count: '20+', color: '#FF5722' },
    { name: 'Dairy', icon: '🥛', count: '15+', color: '#2196F3' },
    { name: 'Spices', icon: '🌶️', count: '25+', color: '#E91E63' },
  ];

  const testimonials = [
    {
      name: 'Kwame Mensah',
      role: 'Consumer',
      image: '👨🏿‍🌾',
      text: 'Best quality produce I\'ve ever bought! Fresh, affordable, and delivered right to my door.',
      rating: 5,
    },
    {
      name: 'Ama Osei',
      role: 'Farmer',
      image: '👩🏿‍🌾',
      text: 'This platform changed my business. I can now reach customers directly and get fair prices.',
      rating: 5,
    },
    {
      name: 'Kofi Asante',
      role: 'Consumer',
      image: '👨🏿',
      text: 'Supporting local farmers while getting the freshest products. Win-win!',
      rating: 5,
    },
  ];

  return (
    <div className="home-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>

        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <i className="fas fa-robot"></i>
              <span>AI-Powered Smart Farming</span>
            </div>
            <h1 className="hero-title">
              Fresh from <span className="gradient-text">Ghana's</span>
              <br />
              <span className="gradient-text">16 Regions</span>
            </h1>
            
            {/* AI Badge */}
            <div className="ai-badge-hero">
              <div className="ai-pulse"></div>
              <i className="fas fa-brain"></i>
              <span>Enhanced by Artificial Intelligence</span>
            </div>
            
            {/* Animated Regional Highlights */}
            <div className="regional-showcase">
              <div className="region-card" key={currentRegion}>
                <div className="region-icon">{ghanaRegions[currentRegion].icon}</div>
                <div className="region-info">
                  <h3>{ghanaRegions[currentRegion].capital}</h3>
                  <p className="region-name">{ghanaRegions[currentRegion].region} Region</p>
                  <p className="region-highlight">{ghanaRegions[currentRegion].highlight}</p>
                </div>
              </div>
              <div className="region-indicators">
                {ghanaRegions.map((_, index) => (
                  <span 
                    key={index} 
                    className={`indicator ${index === currentRegion ? 'active' : ''}`}
                    onClick={() => setCurrentRegion(index)}
                  ></span>
                ))}
              </div>
            </div>

            <p className="hero-description">
              Connect directly with farmers across all 16 regions of Ghana. Get the freshest produce, 
              poultry, and more delivered to your doorstep. Support local agriculture nationwide!
            </p>
            <div className="hero-buttons">
              <Link to="/shop" className="btn btn-primary">
                <i className="fas fa-shopping-bag"></i>
                Start Shopping
              </Link>
              <Link to="/register" className="btn btn-secondary">
                <i className="fas fa-user-plus"></i>
                Join as Farmer
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <strong>16</strong>
                <span>Regions</span>
              </div>
              <div className="stat">
                <strong>1,250+</strong>
                <span>Farmers</span>
              </div>
              <div className="stat">
                <strong>5,000+</strong>
                <span>Products</span>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <div className="floating-card card-1">
              <img src="/images/tomato.jpg" alt="Fresh Tomatoes" />
              <div className="card-content">
                <h4>Fresh Tomatoes</h4>
                <p>GH₵ 15.00/kg</p>
                <div className="rating">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <div className="floating-card card-2">
              <img src="/images/banana.jpg" alt="Ripe Bananas" />
              <div className="card-content">
                <h4>Ripe Bananas</h4>
                <p>GH₵ 10.00/bunch</p>
                <div className="rating">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <div className="floating-card card-3">
              <img src="/images/eggs.jpg" alt="Farm Eggs" />
              <div className="card-content">
                <h4>Farm Eggs</h4>
                <p>GH₵ 30.00/crate</p>
                <div className="rating">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <div className="floating-card card-4">
              <img src="/images/pineapple.jpg" alt="Fresh Pineapple" />
              <div className="card-content">
                <h4>Fresh Pineapple</h4>
                <p>GH₵ 20.00/piece</p>
                <div className="rating">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Powered Farming Section */}
      <section className="ai-farming-section">
        <div className="container">
          <div className="section-header">
            <div className="ai-badge">
              <i className="fas fa-brain"></i>
              <span>AI-Powered Technology</span>
            </div>
            <h2>Smart Farming with AI</h2>
            <p>Using Artificial Intelligence to boost productivity and sustainability</p>
          </div>

          <div className="ai-features-grid">
            <div className="ai-feature-card">
              <div className="ai-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Yield Optimization</h3>
              <p>AI analyzes soil and weather to maximize harvests</p>
              <span className="ai-badge-stat">+40% Yield</span>
            </div>

            <div className="ai-feature-card">
              <div className="ai-icon">
                <i className="fas fa-cloud-sun-rain"></i>
              </div>
              <h3>Weather Prediction</h3>
              <p>Accurate forecasts for better planning</p>
              <span className="ai-badge-stat">95% Accuracy</span>
            </div>

            <div className="ai-feature-card">
              <div className="ai-icon">
                <i className="fas fa-bug"></i>
              </div>
              <h3>Disease Detection</h3>
              <p>Early identification reduces crop losses</p>
              <span className="ai-badge-stat">-60% Loss</span>
            </div>

            <div className="ai-feature-card">
              <div className="ai-icon">
                <i className="fas fa-tint"></i>
              </div>
              <h3>Water Management</h3>
              <p>Smart irrigation conserves resources</p>
              <span className="ai-badge-stat">-35% Water</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Smart Farming 360?</h2>
            <p>Experience the future of farm-to-table shopping</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <p>Explore our wide range of fresh products</p>
          </div>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/shop?category=${category.name.toLowerCase()}`}
                className="category-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="category-icon" style={{ background: category.color }}>
                  {category.icon}
                </div>
                <h3>{category.name}</h3>
                <p>{category.count} Products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Simple steps to get fresh products delivered</p>
          </div>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-icon">🔍</div>
              <h3>Browse Products</h3>
              <p>Explore thousands of fresh products from local farmers</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-icon">🛒</div>
              <h3>Add to Cart</h3>
              <p>Select your favorite products and add them to cart</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-icon">💳</div>
              <h3>Checkout</h3>
              <p>Secure payment with multiple options available</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-icon">🚚</div>
              <h3>Get Delivered</h3>
              <p>Fast delivery right to your doorstep</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Community Says</h2>
            <p>Real stories from farmers and consumers</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="testimonial-rating">
                  {Array(testimonial.rating).fill('⭐').join('')}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.image}</div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="download-app-section">
        <div className="download-bg">
          <div className="download-orb download-orb-1"></div>
          <div className="download-orb download-orb-2"></div>
          <div className="download-grid-pattern"></div>
        </div>
        
        <div className="container">
          <div className="download-content">
            <div className="download-text">
              <div className="download-badge">
                <i className="fas fa-mobile-alt"></i>
                <span>Available on All Devices</span>
              </div>
              
              <h2 className="download-title">
                Get the <span className="gradient-text">Smart Farming 360</span> App
              </h2>
              
              <p className="download-description">
                Download our mobile app for the best experience. Shop offline, get instant 
                notifications, and enjoy lightning-fast performance on any device!
              </p>

              <div className="download-features">
                <div className="download-feature">
                  <div className="feature-check">✓</div>
                  <div>
                    <h4>Works Offline</h4>
                    <p>Browse products without internet</p>
                  </div>
                </div>
                <div className="download-feature">
                  <div className="feature-check">✓</div>
                  <div>
                    <h4>Instant Notifications</h4>
                    <p>Get real-time order updates</p>
                  </div>
                </div>
                <div className="download-feature">
                  <div className="feature-check">✓</div>
                  <div>
                    <h4>Lightning Fast</h4>
                    <p>Optimized for speed</p>
                  </div>
                </div>
                <div className="download-feature">
                  <div className="feature-check">✓</div>
                  <div>
                    <h4>Easy Install</h4>
                    <p>One-click installation</p>
                  </div>
                </div>
              </div>

              <div className="download-buttons">
                <button className="btn-install-pwa" onClick={handleInstallClick}>
                  <div className="btn-icon">
                    <i className="fas fa-download"></i>
                  </div>
                  <div className="btn-text">
                    <span className="btn-label">{isInstallable ? 'Download App' : 'Open App'}</span>
                    <span className="btn-sublabel">Free • No Sign Up Required</span>
                  </div>
                </button>
                
                <div className="platform-badges">
                  <div className="platform-badge">
                    <i className="fab fa-chrome"></i>
                    <span>Chrome</span>
                  </div>
                  <div className="platform-badge">
                    <i className="fab fa-edge"></i>
                    <span>Edge</span>
                  </div>
                  <div className="platform-badge">
                    <i className="fab fa-safari"></i>
                    <span>Safari</span>
                  </div>
                  <div className="platform-badge">
                    <i className="fab fa-android"></i>
                    <span>Android</span>
                  </div>
                  <div className="platform-badge">
                    <i className="fab fa-apple"></i>
                    <span>iOS</span>
                  </div>
                </div>
              </div>

              <div className="download-stats">
                <div className="stat-item">
                  <div className="stat-icon">⚡</div>
                  <div>
                    <strong>90%</strong>
                    <span>Faster Loading</span>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">🛡️</div>
                  <div>
                    <strong>100%</strong>
                    <span>Secure Payments</span>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">📦</div>
                  <div>
                    <strong>24/7</strong>
                    <span>Order Tracking</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="download-visual">
              <div className="phone-mockup">
                <div className="phone-frame">
                  <div className="phone-notch"></div>
                  <div className="phone-screen">
                    <div className="screen-content">
                      <div className="app-header">
                        <div className="app-time">9:41</div>
                        <div className="app-icons">
                          <i className="fas fa-signal"></i>
                          <i className="fas fa-wifi"></i>
                          <i className="fas fa-battery-full"></i>
                        </div>
                      </div>
                      <div className="app-body">
                        <div className="app-logo">🌾</div>
                        <h3>Smart Farming 360</h3>
                        <p>Fresh from Ghana's Farms</p>
                        <div className="app-products">
                          <div className="mini-product">🍅</div>
                          <div className="mini-product">🥬</div>
                          <div className="mini-product">🍍</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="phone-button"></div>
                </div>
                <div className="phone-shadow"></div>
              </div>

              <div className="floating-badge badge-1">
                <i className="fas fa-bolt"></i>
                <span>Fast</span>
              </div>
              <div className="floating-badge badge-2">
                <i className="fas fa-shield-alt"></i>
                <span>Secure</span>
              </div>
              <div className="floating-badge badge-3">
                <i className="fas fa-wifi"></i>
                <span>Offline</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience Fresh?</h2>
            <p>Join thousands of satisfied customers enjoying farm-fresh products</p>
            <div className="cta-buttons">
              <Link to="/shop" className="btn btn-primary btn-large">
                <i className="fas fa-shopping-bag"></i>
                Start Shopping Now
              </Link>
              <Link to="/register" className="btn btn-secondary btn-large">
                <i className="fas fa-user-plus"></i>
                Become a Farmer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3>Smart Farming 360</h3>
              <p>Connecting farmers and consumers for a sustainable future.</p>
              <div className="social-links">
                <a href="#"><i className="fab fa-facebook"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/shop">Shop</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/register">Become a Farmer</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <ul>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/contact">FAQ</Link></li>
                <li><Link to="/contact">Shipping Info</Link></li>
                <li><Link to="/contact">Returns</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Newsletter</h4>
              <p>Subscribe for updates and special offers</p>
              <form 
                action="https://formspree.io/f/myknlygk" 
                method="POST"
                className="newsletter-form"
              >
                <input 
                  type="email" 
                  name="email"
                  placeholder="Your email" 
                  required
                />
                <input type="hidden" name="_subject" value="Newsletter Subscription - Smart Farming 360" />
                <input type="hidden" name="_next" value={`${window.location.origin}/?subscribed=true`} />
                <button type="submit"><i className="fas fa-paper-plane"></i></button>
              </form>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Smart Farming 360. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
