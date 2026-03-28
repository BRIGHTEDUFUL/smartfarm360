import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import "./CartPage.css";

const CartPage = () => {
  const [loading, setLoading] = useState(true);
  const { items, updateQuantity, removeItem, refreshCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    loadCart();
  }, [isAuthenticated, navigate]);

  const loadCart = async () => {
    try {
      setLoading(true);
      await refreshCart();
    } catch (error) {
      console.error("Failed to load cart:", error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (
    productId: number,
    newQuantity: number,
  ) => {
    if (newQuantity < 1) return;

    try {
      await updateQuantity(productId, newQuantity);
      toast.success("Cart updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update cart");
    }
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      await removeItem(productId);
      toast.success("Item removed from cart");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove item");
    }
  };

  const getImagePath = (productName: string) => {
    const imageMap: { [key: string]: string } = {
      "Fresh Tomatoes": "/images/tomato.jpg",
      "Garden Eggs": "/images/eggplant.jpg",
      "Fresh Carrots": "/images/carrot.jpg",
      "Fresh Onions": "/images/Onions.jpg",
      "Fresh Okra": "/images/okra.jpg",
      "Ripe Bananas": "/images/banana.jpg",
      "Fresh Pineapples": "/images/pineapple.jpg",
      Watermelon: "/images/watermelon.jpg",
      "Fresh Avocado": "/images/avocado.jpg",
      "Ripe Mangoes": "/images/mango.webp",
      "Sweet Corn": "/images/maize.jpg",
      "Premium Rice": "/images/rice.jpg",
      "Brown Beans": "/images/BEANS.jpg",
      "Pearl Millets": "/images/Millets.webp",
      "Fresh Cassava": "/images/casasava.jpg",
      "White Yam": "/images/yam.jpg",
      Cocoyam: "/images/cocoyam.jpg",
      "Sweet Potatoes": "/images/sweet potatoes.jpeg",
      "Free Range Eggs": "/images/eggs.jpg",
      "Whole Chicken": "/images/chicken.jpg",
      "Duck Meat": "/images/Duck.jpg",
      Turkey: "/images/turkey.webp",
      "Fresh Beef": "/images/beef.jpg",
      "Pork Meat": "/images/pork.jpg",
      "Goat Meat": "/images/goats.webp",
      "Fresh Fish": "/images/fish.jpg",
      "Snail Meat": "/images/Snail.jpg",
      "Rabbit Meat": "/images/rabbit.jpg",
      "Fresh Milk": "/images/milk.jpg",
      "Hot Pepper": "/images/pepper.jpg",
      "Fresh Chilli": "/images/chilli.jpg",
      "Fresh Ginger": "/images/ginger.jpg",
      "Raw Honey": "/images/honey.jpg",
      "Shito Pepper": "/images/Shito.jpeg",
      "Prekese Spice": "/images/Prekese.jpeg",
    };
    return imageMap[productName] || "/images/vegitales.jpg";
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.125; // 12.5% VAT
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.warning("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div>
        <div className="cart-loading">
          <div className="loading-spinner"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-header-section">
            <h1>Shopping Cart</h1>
            <p>
              {items.length} {items.length === 1 ? "item" : "items"} in your
              cart
            </p>
          </div>

          {items.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Add some fresh products from our shop to get started!</p>
              <Link to="/shop" className="btn-shop-now">
                <i className="fas fa-shopping-bag"></i>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items-section">
                {items.map((item) => (
                  <div key={item.product_id} className="cart-item-card">
                    <div className="cart-item-image">
                      <img src={getImagePath(item.name)} alt={item.name} />
                    </div>

                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p className="cart-item-price">
                        GH₵ {item.price.toFixed(2)} / {item.unit}
                      </p>
                      <p className="cart-item-stock">
                        {item.stock_quantity > 10 ? (
                          <span className="in-stock">
                            <i className="fas fa-check-circle"></i>
                            In Stock
                          </span>
                        ) : item.stock_quantity > 0 ? (
                          <span className="low-stock">
                            <i className="fas fa-exclamation-circle"></i>
                            Only {item.stock_quantity} left
                          </span>
                        ) : (
                          <span className="out-of-stock">
                            <i className="fas fa-times-circle"></i>
                            Out of Stock
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product_id,
                              item.quantity - 1,
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product_id,
                              item.quantity + 1,
                            )
                          }
                          disabled={item.quantity >= item.stock_quantity}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>

                      <div className="cart-item-total">
                        <span className="total-label">Total:</span>
                        <span className="total-amount">
                          GH₵ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveItem(item.product_id)}
                      >
                        <i className="fas fa-trash-alt"></i>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary-section">
                <div className="cart-summary-card">
                  <h2>Order Summary</h2>

                  <div className="summary-row">
                    <span>Subtotal ({items.length} items)</span>
                    <span>GH₵ {calculateSubtotal().toFixed(2)}</span>
                  </div>

                  <div className="summary-row">
                    <span>Tax (12.5% VAT)</span>
                    <span>GH₵ {calculateTax().toFixed(2)}</span>
                  </div>

                  <div className="summary-row">
                    <span>Shipping</span>
                    <span className="free-shipping">FREE</span>
                  </div>

                  <div className="summary-divider"></div>

                  <div className="summary-row total-row">
                    <span>Total</span>
                    <span>GH₵ {calculateTotal().toFixed(2)}</span>
                  </div>

                  <button className="checkout-btn" onClick={handleCheckout}>
                    <i className="fas fa-lock"></i>
                    Proceed to Checkout
                  </button>

                  <Link to="/shop" className="continue-shopping-link">
                    <i className="fas fa-arrow-left"></i>
                    Continue Shopping
                  </Link>
                </div>

                <div className="cart-benefits">
                  <div className="benefit-item">
                    <i className="fas fa-truck"></i>
                    <div>
                      <strong>Free Delivery</strong>
                      <p>On orders over GH₵ 100</p>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <i className="fas fa-shield-alt"></i>
                    <div>
                      <strong>Secure Payment</strong>
                      <p>100% secure transactions</p>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <i className="fas fa-undo"></i>
                    <div>
                      <strong>Easy Returns</strong>
                      <p>7-day return policy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
