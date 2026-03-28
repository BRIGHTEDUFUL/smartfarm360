import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { usePwa } from "../contexts/PwaContext";

import "./HomePage.css";

type RegionSpotlight = {
  capital: string;
  region: string;
  highlight: string;
  image: string;
  imageAlt: string;
};

type Feature = {
  icon: string;
  title: string;
  description: string;
};

type Category = {
  name: string;
  icon: string;
  count: string;
  color: string;
};

type Testimonial = {
  name: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
};

const ghanaRegions: RegionSpotlight[] = [
  {
    capital: "Accra",
    region: "Greater Accra",
    highlight: "Urban farming and fresh vegetables",
    image: "/images/tomato.jpg",
    imageAlt: "Fresh tomatoes from Accra",
  },
  {
    capital: "Kumasi",
    region: "Ashanti",
    highlight: "Cocoa and plantain hub",
    image: "/images/banana.jpg",
    imageAlt: "Plantains and bananas from Kumasi",
  },
  {
    capital: "Tamale",
    region: "Northern",
    highlight: "Rice and groundnut capital",
    image: "/images/rice.jpg",
    imageAlt: "Rice fields in Tamale",
  },
  {
    capital: "Cape Coast",
    region: "Central",
    highlight: "Coconut and cassava farms",
    image: "/images/casasava.jpg",
    imageAlt: "Cassava produce from Cape Coast",
  },
  {
    capital: "Sekondi-Takoradi",
    region: "Western",
    highlight: "Palm oil and rubber plantations",
    image: "/images/avocado.jpg",
    imageAlt: "Fresh produce from Sekondi-Takoradi",
  },
  {
    capital: "Koforidua",
    region: "Eastern",
    highlight: "Pineapple and citrus paradise",
    image: "/images/pineapple.jpg",
    imageAlt: "Pineapples from Koforidua",
  },
  {
    capital: "Ho",
    region: "Volta",
    highlight: "Organic vegetables and spices",
    image: "/images/pepper.jpg",
    imageAlt: "Peppers and spices from Ho",
  },
  {
    capital: "Sunyani",
    region: "Bono",
    highlight: "Cashew and maize farms",
    image: "/images/maize.jpg",
    imageAlt: "Maize harvest in Sunyani",
  },
  {
    capital: "Bolgatanga",
    region: "Upper East",
    highlight: "Millet and sorghum fields",
    image: "/images/Millets.webp",
    imageAlt: "Millet produce from Bolgatanga",
  },
  {
    capital: "Wa",
    region: "Upper West",
    highlight: "Shea butter and groundnuts",
    image: "/images/ginger.jpg",
    imageAlt: "Ground crops from Wa",
  },
  {
    capital: "Goaso",
    region: "Ahafo",
    highlight: "Cocoa and coffee estates",
    image: "/images/mango.webp",
    imageAlt: "Farm produce from Goaso",
  },
  {
    capital: "Dambai",
    region: "Oti",
    highlight: "Yam and soybean cultivation",
    image: "/images/yam.jpg",
    imageAlt: "Yams from Dambai",
  },
  {
    capital: "Nalerigu",
    region: "North East",
    highlight: "Livestock and grain farming",
    image: "/images/Cow.jpg",
    imageAlt: "Livestock farming in Nalerigu",
  },
  {
    capital: "Damongo",
    region: "Savannah",
    highlight: "Cashew and shea production",
    image: "/images/watermelon.jpg",
    imageAlt: "Fresh produce from Damongo",
  },
  {
    capital: "Sefwi Wiawso",
    region: "Western North",
    highlight: "Cocoa and timber resources",
    image: "/images/okra.jpg",
    imageAlt: "Okra produce from Sefwi Wiawso",
  },
  {
    capital: "Bechem",
    region: "Bono East",
    highlight: "Tomato and pepper farms",
    image: "/images/chilli.jpg",
    imageAlt: "Chilli peppers from Bechem",
  },
];

const features: Feature[] = [
  {
    icon: "fas fa-seedling",
    title: "Farm Fresh Products",
    description:
      "Direct from local farmers to your doorstep. Fresh, traceable, and sustainably grown.",
  },
  {
    icon: "fas fa-truck",
    title: "Fast Delivery",
    description:
      "Same-day delivery options with dependable updates from farm pickup to doorstep.",
  },
  {
    icon: "fas fa-balance-scale",
    title: "Fair Prices",
    description:
      "Fewer middlemen means better value for shoppers and stronger margins for farmers.",
  },
  {
    icon: "fas fa-shield-alt",
    title: "Quality Guaranteed",
    description:
      "Every listing is reviewed for consistency, freshness, and marketplace standards.",
  },
];

const categories: Category[] = [
  { name: "Vegetables", icon: "fas fa-carrot", count: "50+", color: "#4CAF50" },
  { name: "Fruits", icon: "fas fa-apple-alt", count: "40+", color: "#FF9800" },
  { name: "Grains", icon: "fas fa-seedling", count: "30+", color: "#8D6E63" },
  { name: "Poultry", icon: "fas fa-egg", count: "20+", color: "#FF5722" },
  { name: "Dairy", icon: "fas fa-tint", count: "15+", color: "#2196F3" },
  { name: "Spices", icon: "fas fa-pepper-hot", count: "25+", color: "#E91E63" },
];

const testimonials: Testimonial[] = [
  {
    name: "Kwame Mensah",
    role: "Consumer",
    avatar: "KM",
    text: "Best quality produce I've ever bought. Fresh, affordable, and delivered right to my door.",
    rating: 5,
  },
  {
    name: "Ama Osei",
    role: "Farmer",
    avatar: "AO",
    text: "This platform changed my business. I can now reach customers directly and get fair prices.",
    rating: 5,
  },
  {
    name: "Kofi Asante",
    role: "Consumer",
    avatar: "KA",
    text: "Supporting local farmers while getting the freshest products is a real win-win.",
    rating: 5,
  },
];

const heroCards = [
  {
    className: "card-1",
    image: "/images/tomato.jpg",
    title: "Fresh Tomatoes",
    price: "GHc 15.00/kg",
  },
  {
    className: "card-2",
    image: "/images/banana.jpg",
    title: "Ripe Bananas",
    price: "GHc 10.00/bunch",
  },
  {
    className: "card-3",
    image: "/images/eggs.jpg",
    title: "Farm Eggs",
    price: "GHc 30.00/crate",
  },
  {
    className: "card-4",
    image: "/images/pineapple.jpg",
    title: "Fresh Pineapple",
    price: "GHc 20.00/piece",
  },
  {
    className: "card-5",
    image: "/images/mango.webp",
    title: "Golden Mangoes",
    price: "GHc 18.00/basket",
  },
  {
    className: "card-6",
    image: "/images/avocado.jpg",
    title: "Creamy Avocados",
    price: "GHc 14.00/bag",
  },
];

const renderStars = (count: number) =>
  Array.from({ length: count }, (_, index) => (
    <i key={index} className="fas fa-star" aria-hidden="true"></i>
  ));

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { canInstall, installHint, isInstalling, installApp } = usePwa();
  const [currentRegion, setCurrentRegion] = useState(0);
  const [showNewsletterSuccess, setShowNewsletterSuccess] = useState(false);
  const newsletterTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (searchParams.get("subscribed") === "true") {
      setShowNewsletterSuccess(true);
      newsletterTimerRef.current = window.setTimeout(() => {
        navigate("/", { replace: true });
        setShowNewsletterSuccess(false);
      }, 5000);
    }

    return () => {
      if (newsletterTimerRef.current !== null) {
        window.clearTimeout(newsletterTimerRef.current);
      }
    };
  }, [navigate, searchParams]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentRegion((prev) => (prev + 1) % ghanaRegions.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, []);

  const handleInstallClick = async () => {
    await installApp();
  };

  const showPreviousRegion = () => {
    setCurrentRegion(
      (prev) => (prev - 1 + ghanaRegions.length) % ghanaRegions.length,
    );
  };

  const showNextRegion = () => {
    setCurrentRegion((prev) => (prev + 1) % ghanaRegions.length);
  };

  const activeRegion = ghanaRegions[currentRegion];
  const regionProgress = ((currentRegion + 1) / ghanaRegions.length) * 100;

  return (
    <div className="home-page">
      {showNewsletterSuccess && (
        <div className="newsletter-success-banner">
          <div className="success-content">
            <i className="fas fa-check-circle"></i>
            <div>
              <h3>Successfully Subscribed!</h3>
              <p>
                Thank you for subscribing to Smart Farming 360 newsletter. Stay
                tuned for updates.
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>

        <div className="hero-content">
          <div className="hero-copy-top">
            <div className="hero-badge">
              <i className="fas fa-robot"></i>
              <span>AI-Powered Smart Farming</span>
            </div>

            <h1 className="hero-title">
              Fresh from <span className="gradient-text">Ghana&apos;s</span>
              <br />
              <span className="gradient-text">16 Regions</span>
            </h1>

            <div className="ai-badge-hero">
              <div className="ai-pulse"></div>
              <i className="fas fa-brain"></i>
              <span>Enhanced by Artificial Intelligence</span>
            </div>
          </div>

          <div className="hero-image" aria-label="Featured products">
            {heroCards.map((card) => (
              <div key={card.title} className={`floating-card ${card.className}`}>
                <img src={card.image} alt={card.title} />
                <div className="card-content">
                  <h4>{card.title}</h4>
                  <p>{card.price}</p>
                  <div className="rating" aria-label="Five star produce">
                    {renderStars(5)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hero-copy-bottom">
            <div className="regional-showcase">
              <div className="region-card" key={activeRegion.capital}>
                <div className="region-icon">
                  <img src={activeRegion.image} alt={activeRegion.imageAlt} />
                </div>
                <div className="region-info">
                  <h3>{activeRegion.capital}</h3>
                  <p className="region-name">{activeRegion.region} Region</p>
                  <p className="region-highlight">{activeRegion.highlight}</p>
                </div>
              </div>

              <div className="region-controls">
                <button
                  type="button"
                  className="region-nav-btn"
                  onClick={showPreviousRegion}
                  aria-label="Show previous region"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                <div className="region-progress-group">
                  <div className="region-progress-label">
                    <span>Regional spotlight</span>
                    <strong>
                      {currentRegion + 1} / {ghanaRegions.length}
                    </strong>
                  </div>
                  <div className="region-progress-track" aria-hidden="true">
                    <span
                      className="region-progress-fill"
                      style={{ width: `${regionProgress}%` }}
                    ></span>
                  </div>
                </div>

                <button
                  type="button"
                  className="region-nav-btn"
                  onClick={showNextRegion}
                  aria-label="Show next region"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>

            <p className="hero-description">
              Connect directly with farmers across all 16 regions of Ghana. Get
              the freshest produce, poultry, and more delivered to your
              doorstep. Support local agriculture nationwide.
            </p>

            <div className="hero-buttons">
              <Link to="/shop" className="btn btn-primary">
                <i className="fas fa-shopping-bag"></i>
                Start Shopping
              </Link>
              <Link
                to="/register"
                className="btn btn-secondary hero-btn-secondary"
              >
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
        </div>
      </section>

      <section className="pwa-section">
        <div className="container">
          <div className="pwa-panel">
            <div className="pwa-copy">
              <div className="pwa-eyebrow">
                <i className="fas fa-mobile-alt"></i>
                <span>Install Smart Farming 360</span>
              </div>
              <h2>Keep Smart Farming 360 on your device</h2>
              <p>
                Install the app for a faster launch experience, a full-screen
                layout, and reliable app-shell access even when the network is
                unstable.
              </p>

              <div className="pwa-feature-list">
                <div className="pwa-feature-item">
                  <i className="fas fa-bolt"></i>
                  <span>Launch from your home screen like a real app</span>
                </div>
                <div className="pwa-feature-item">
                  <i className="fas fa-wifi"></i>
                  <span>Offline fallback for previously loaded pages</span>
                </div>
                <div className="pwa-feature-item">
                  <i className="fas fa-shield-alt"></i>
                  <span>No stale API caching that can break live data</span>
                </div>
              </div>

              <div className="pwa-actions">
                {canInstall ? (
                  <button
                    type="button"
                    className="btn btn-primary pwa-install-btn"
                    onClick={handleInstallClick}
                    disabled={isInstalling}
                  >
                    <i className="fas fa-download"></i>
                    {isInstalling ? "Installing..." : "Install the App"}
                  </button>
                ) : (
                  <div className="pwa-install-note">
                    <strong>{installHint.title}</strong>
                    <span>{installHint.detail}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pwa-device">
              <div className="pwa-device-shell">
                <div className="pwa-device-notch"></div>
                <div className="pwa-device-screen">
                  <div className="pwa-status-bar">
                    <span>9:41</span>
                    <div className="pwa-status-icons">
                      <i className="fas fa-signal"></i>
                      <i className="fas fa-wifi"></i>
                      <i className="fas fa-battery-full"></i>
                    </div>
                  </div>
                  <div className="pwa-brand-mark">
                    <img src="/icons/icon-192.png" alt="Smart Farming 360" />
                  </div>
                  <h3>Smart Farming 360</h3>
                  <p>Fresh from Ghana&apos;s farms</p>
                  <div className="pwa-app-badges">
                    <span>Fast</span>
                    <span>Installable</span>
                    <span>Reliable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ai-farming-section">
        <div className="container">
          <div className="section-header">
            <div className="ai-badge">
              <i className="fas fa-brain"></i>
              <span>AI-Powered Technology</span>
            </div>
            <h2>Smart Farming with AI</h2>
            <p>
              Using Artificial Intelligence to boost productivity and
              sustainability
            </p>
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

      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Smart Farming 360?</h2>
            <p>Experience the future of farm-to-table shopping</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="feature-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon">
                  <i className={feature.icon}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <p>Explore our wide range of fresh products</p>
          </div>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={`/shop?category=${category.name.toLowerCase()}`}
                className="category-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className="category-icon"
                  style={{ background: category.color }}
                >
                  <i className={category.icon}></i>
                </div>
                <h3>{category.name}</h3>
                <p>{category.count} Products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Simple steps to get fresh products delivered</p>
          </div>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-icon">
                <i className="fas fa-search"></i>
              </div>
              <h3>Browse Products</h3>
              <p>Explore thousands of fresh products from local farmers</p>
            </div>
            <div className="step-arrow">
              <i className="fas fa-arrow-right" aria-hidden="true"></i>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <h3>Add to Cart</h3>
              <p>Select your favorite products and add them to cart</p>
            </div>
            <div className="step-arrow">
              <i className="fas fa-arrow-right" aria-hidden="true"></i>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-icon">
                <i className="fas fa-credit-card"></i>
              </div>
              <h3>Checkout</h3>
              <p>Secure payment with multiple options available</p>
            </div>
            <div className="step-arrow">
              <i className="fas fa-arrow-right" aria-hidden="true"></i>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-icon">
                <i className="fas fa-truck"></i>
              </div>
              <h3>Get Delivered</h3>
              <p>Fast delivery right to your doorstep</p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Community Says</h2>
            <p>Real stories from farmers and consumers</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="testimonial-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className="testimonial-rating"
                  aria-label={`${testimonial.rating} stars`}
                >
                  {renderStars(testimonial.rating)}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
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

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience Fresh?</h2>
            <p>
              Join thousands of satisfied customers enjoying farm-fresh products
            </p>
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

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3>Smart Farming 360</h3>
              <p>Connecting farmers and consumers for a sustainable future.</p>
              <div className="social-links">
                <a href="#">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#">
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <Link to="/shop">Shop</Link>
                </li>
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link to="/register">Become a Farmer</Link>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <ul>
                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link to="/contact">FAQ</Link>
                </li>
                <li>
                  <Link to="/contact">Shipping Info</Link>
                </li>
                <li>
                  <Link to="/contact">Returns</Link>
                </li>
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
                <input
                  type="hidden"
                  name="_subject"
                  value="Newsletter Subscription - Smart Farming 360"
                />
                <input
                  type="hidden"
                  name="_next"
                  value={`${window.location.origin}/?subscribed=true`}
                />
                <button type="submit">
                  <i className="fas fa-paper-plane"></i>
                </button>
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
