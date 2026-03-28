import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import "./ContactPage.css";

const ContactPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("submitted") === "true") {
      setShowSuccess(true);
      // Clear the URL parameter after 5 seconds
      setTimeout(() => {
        navigate("/contact", { replace: true });
        setShowSuccess(false);
      }, 5000);
    }
  }, [searchParams, navigate]);

  return (
    <div>
      <div className="contact-page">
        <div className="contact-container">
          {/* Success Message */}
          {showSuccess && (
            <div className="success-banner">
              <div className="success-content">
                <i className="fas fa-check-circle"></i>
                <div>
                  <h3>Message Sent Successfully!</h3>
                  <p>
                    Thank you for contacting Smart Farming 360. We'll get back
                    to you soon.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="contact-header">
            <div className="header-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <h1>Get in Touch</h1>
            <p>
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>
          </div>

          <div className="contact-content">
            {/* Contact Form */}
            <div className="contact-form-section">
              <form
                action="https://formspree.io/f/myknlygk"
                method="POST"
                className="contact-form"
              >
                <input
                  type="hidden"
                  name="_subject"
                  value="Contact Form - Smart Farming 360"
                />
                <input
                  type="hidden"
                  name="_next"
                  value={`${window.location.origin}/contact?submitted=true`}
                />

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">
                      <i className="fas fa-user"></i>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <i className="fas fa-envelope"></i>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    <i className="fas fa-phone"></i>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+233 50 123 4567"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">
                    <i className="fas fa-tag"></i>
                    Subject *
                  </label>
                  <select id="subject" name="subject" required>
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Product Question">Product Question</option>
                    <option value="Order Support">Order Support</option>
                    <option value="Farmer Registration">
                      Farmer Registration
                    </option>
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="Partnership">Partnership Opportunity</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    <i className="fas fa-comment-alt"></i>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Tell us how we can help you..."
                    required
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn">
                  <i className="fas fa-paper-plane"></i>
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info-section">
              <div className="info-card">
                <div className="info-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h3>Visit Us</h3>
                <p>
                  Accra, Ghana
                  <br />
                  East Legon, Accra
                </p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <h3>Call Us</h3>
                <p>
                  +233 50 123 4567
                  <br />
                  Mon-Fri, 8am-6pm
                </p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <h3>Email Us</h3>
                <p>
                  support@smartfarming360.com
                  <br />
                  info@smartfarming360.com
                </p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <h3>Business Hours</h3>
                <p>
                  Monday - Friday: 8am - 6pm
                  <br />
                  Saturday: 9am - 4pm
                  <br />
                  Sunday: Closed
                </p>
              </div>

              <div className="social-section">
                <h3>Follow Us</h3>
                <div className="social-links">
                  <a href="#" className="social-link facebook">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="social-link twitter">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-link instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="social-link linkedin">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
