import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productsAPI } from "../services/api";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import "./ProductDetailPage.css";

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
  image_url?: string;
  farmer_first_name?: string;
  farmer_last_name?: string;
  farmer_phone?: string;
  farm_name?: string;
  farm_location?: string;
  farmer_verification_status?: string;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  Vegetables: "🥬",
  Fruits: "🍎",
  Grains: "🌾",
  Poultry: "🐔",
  Meat: "🥩",
  Dairy: "🥛",
  Spices: "🌶️",
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setQuantity(1);

    productsAPI
      .getById(parseInt(id))
      .then((res) => {
        const prod = res.data?.data;
        setProduct(prod);
        if (prod?.category) {
          productsAPI
            .getAll({ category: prod.category, status: "Active", limit: 4 })
            .then((relRes) => {
              const rel = (relRes.data?.data || []).filter(
                (p: Product) => p.id !== prod.id
              );
              setRelatedProducts(rel.slice(0, 4));
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        toast.error("Failed to load product details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleQuantityChange = (val: number) => {
    if (!product) return;
    const nextVal = Math.max(1, Math.min(product.stock_quantity || 1, val));
    setQuantity(nextVal);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      toast.info("Please login to add items to cart");
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      toast.success(`${quantity} ${product.unit} of ${product.name} added to cart!`);
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleMessageFarmer = () => {
    if (!product) return;
    if (!isAuthenticated) {
      toast.info("Please login to message the farmer");
      navigate("/login");
      return;
    }
    navigate(`/messages?partner=${product.farmer_id}`);
  };

  if (loading) {
    return (
      <div className="product-detail-page" style={{ textAlign: "center", padding: "5rem 0" }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: "2.5rem", color: "#0d5415" }} />
        <p style={{ marginTop: "1rem", color: "#6b7280" }}>Loading fresh produce details…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page" style={{ textAlign: "center", padding: "5rem 0" }}>
        <h2>Product not found</h2>
        <p style={{ color: "#6b7280", margin: "1rem 0" }}>
          The product you are looking for may have been removed or is unavailable.
        </p>
        <Link
          to="/shop"
          className="btn-primary"
          style={{
            display: "inline-block",
            padding: "0.65rem 1.5rem",
            background: "#0d5415",
            color: "#fff",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const categoryEmoji = CATEGORY_EMOJIS[product.category] || "🌾";
  const inStock = product.stock_quantity > 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 10;
  const farmerInitials = `${product.farmer_first_name?.[0] || "F"}${product.farmer_last_name?.[0] || ""}`;

  return (
    <div className="product-detail-page">
      {/* Breadcrumb navigation */}
      <nav className="product-breadcrumb">
        <Link to="/">Home</Link>
        <span className="product-breadcrumb-sep">/</span>
        <Link to="/shop">Shop</Link>
        <span className="product-breadcrumb-sep">/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>
          {categoryEmoji} {product.category}
        </Link>
        <span className="product-breadcrumb-sep">/</span>
        <span className="product-breadcrumb-current">{product.name}</span>
      </nav>

      {/* Main product layout */}
      <div className="product-detail-layout">
        {/* Left: Product Image */}
        <div className="product-gallery">
          <div className="product-main-img-wrap">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="product-main-img"
              />
            ) : (
              <span className="product-fallback-icon">{categoryEmoji}</span>
            )}
            <span className="product-category-chip">
              {categoryEmoji} {product.category}
            </span>
          </div>
        </div>

        {/* Right: Product Info & Actions */}
        <div className="product-info-panel">
          <h1 className="product-title">{product.name}</h1>

          <div className="product-meta-row">
            <span
              className={`product-stock-badge ${
                !inStock
                  ? "out-of-stock"
                  : isLowStock
                  ? "low-stock"
                  : "in-stock"
              }`}
            >
              <i
                className={`fas ${
                  !inStock
                    ? "fa-times-circle"
                    : isLowStock
                    ? "fa-exclamation-circle"
                    : "fa-check-circle"
                }`}
              />
              {!inStock
                ? "Out of Stock"
                : isLowStock
                ? `Low Stock (${product.stock_quantity} ${product.unit} left)`
                : `In Stock (${product.stock_quantity} ${product.unit} available)`}
            </span>
          </div>

          <div className="product-price-section">
            <span className="product-price-main">
              GH₵ {Number(product.price).toFixed(2)}
            </span>
            <span className="product-price-unit">/ {product.unit}</span>
          </div>

          <div className="product-desc-section">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {/* Add to cart / Quantity actions */}
          {inStock && (
            <div className="product-actions-bar">
              <div className="quantity-picker">
                <button
                  className="qty-btn"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  className="qty-input"
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value) || 1)
                  }
                  min={1}
                  max={product.stock_quantity}
                />
                <button
                  className="qty-btn"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock_quantity}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                className="btn-add-cart"
                onClick={handleAddToCart}
                disabled={addingToCart || !inStock}
              >
                {addingToCart ? (
                  <>
                    <i className="fas fa-spinner fa-spin" /> Adding…
                  </>
                ) : (
                  <>
                    <i className="fas fa-cart-plus" /> Add to Cart
                  </>
                )}
              </button>
            </div>
          )}

          {/* Farmer Card */}
          <div className="farmer-card">
            <div className="farmer-card-header">
              <div className="farmer-avatar">{farmerInitials}</div>
              <div className="farmer-info-text">
                <div className="farmer-name">
                  {product.farmer_first_name
                    ? `${product.farmer_first_name} ${product.farmer_last_name || ""}`
                    : "Local Farmer"}
                  {product.farmer_verification_status === "Verified" && (
                    <span className="verified-tag">✓ Verified Farmer</span>
                  )}
                </div>
                <div className="farm-meta">
                  {product.farm_name ? `🏡 ${product.farm_name}` : "🌱 Certified Local Producer"}
                  {product.farm_location && ` • 📍 ${product.farm_location}`}
                </div>
              </div>
              {user && user.id !== product.farmer_id && (
                <button
                  className="btn-message-farmer"
                  onClick={handleMessageFarmer}
                >
                  <i className="fas fa-comments" /> Message
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="product-trust-badges">
        <div className="trust-badge-item">
          <span className="trust-badge-icon">🌿</span>
          <div>
            <div className="trust-badge-title">100% Farm Fresh</div>
            <div className="trust-badge-sub">Harvested & packed locally</div>
          </div>
        </div>
        <div className="trust-badge-item">
          <span className="trust-badge-icon">🤝</span>
          <div>
            <div className="trust-badge-title">Direct from Farmers</div>
            <div className="trust-badge-sub">Fair price with no middlemen</div>
          </div>
        </div>
        <div className="trust-badge-item">
          <span className="trust-badge-icon">🚚</span>
          <div>
            <div className="trust-badge-title">Reliable Delivery</div>
            <div className="trust-badge-sub">Safe doorstep delivery & pickup</div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <h2>More in {product.category}</h2>
          <div className="related-grid">
            {relatedProducts.map((rel) => {
              const relEmoji = CATEGORY_EMOJIS[rel.category] || "🌾";
              return (
                <Link
                  key={rel.id}
                  to={`/product/${rel.id}`}
                  className="related-card"
                >
                  <div className="related-card-img-wrap">
                    {rel.image_url ? (
                      <img
                        src={rel.image_url}
                        alt={rel.name}
                        className="related-card-img"
                      />
                    ) : (
                      <span style={{ fontSize: "2.5rem" }}>{relEmoji}</span>
                    )}
                  </div>
                  <div className="related-card-body">
                    <div className="related-card-name">{rel.name}</div>
                    <div className="related-card-price">
                      GH₵ {Number(rel.price).toFixed(2)}{" "}
                      <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "#6b7280" }}>
                        / {rel.unit}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
