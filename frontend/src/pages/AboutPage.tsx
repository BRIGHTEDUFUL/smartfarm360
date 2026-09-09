import { Link } from "react-router-dom";
import "./AboutPage.css";

const teamMembers = [
  {
    name: "Grant Anaman",
    role: "Team Lead & Strategy Officer",
    initials: "GA",
    avatarBg: "linear-gradient(135deg, #0d5415 0%, #1b7e28 100%)",
    icon: "fa-chess-king",
    bio: "Drives strategic vision, operations management, and stakeholder partnerships across the agricultural ecosystem.",
  },
  {
    name: "Maud Ametefe",
    role: "Marketing & Communications Officer",
    initials: "MA",
    avatarBg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    icon: "fa-bullhorn",
    bio: "Leads outreach campaigns, community engagement, brand messaging, and media relations.",
  },
  {
    name: "Kipo Estellela Aliza",
    role: "Tech Lead Officer",
    initials: "KA",
    avatarBg: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
    icon: "fa-code",
    bio: "Architects the software infrastructure, AI integrations, and full-stack engineering across mobile and web.",
  },
  {
    name: "Derrick Salasi K. Selormey",
    role: "Finance & Business Development Lead",
    initials: "DS",
    avatarBg: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
    icon: "fa-chart-line",
    bio: "Manages financial planning, market expansion, commercial monetization, and business sustainability.",
  },
];

const techStack = [
  {
    category: "Frontend",
    icon: "⚛️",
    name: "React 18 + TypeScript",
    desc: "Single-page responsive application with component-driven architecture and strict type safety.",
  },
  {
    category: "Styling & UI",
    icon: "🎨",
    name: "Custom CSS System",
    desc: "Modern responsive design with glassmorphism, fluid layouts, and mobile-first navigation.",
  },
  {
    category: "Backend API",
    icon: "🟢",
    name: "Node.js + Express",
    desc: "Modular RESTful API with middleware authentication, rate limiting, and robust validation.",
  },
  {
    category: "Database",
    icon: "🐘",
    name: "PostgreSQL",
    desc: "Relational persistence with ACID compliance, relational schemas, and indexing for fast querying.",
  },
  {
    category: "Artificial Intelligence",
    icon: "🤖",
    name: "Google Gemini AI",
    desc: "Intelligent agricultural advisor providing real-time crop disease diagnosis and farming recommendations.",
  },
  {
    category: "Hosting & CDN",
    icon: "☁️",
    name: "Cloudflare Pages",
    desc: "Ultra-fast global edge CDN distribution with SSL, caching, and instant static asset delivery.",
  },
  {
    category: "Cloud Infrastructure",
    icon: "🚀",
    name: "Render Cloud",
    desc: "Automated production server environment with health monitoring and continuous deployment.",
  },
  {
    category: "Mobile & Offline",
    icon: "📱",
    name: "PWA (Progressive Web App)",
    desc: "Installable on Android, iOS & Desktop with service worker caching and offline resilience.",
  },
];

const features = [
  { icon: "🛒", text: "Direct farm-to-consumer marketplace" },
  { icon: "🌦️", text: "Real-time weather for all 16 Ghana regions" },
  { icon: "🤖", text: "AI-powered farming advisor & diagnostics" },
  { icon: "💬", text: "Community discussions & officer consultations" },
  { icon: "💧", text: "Smart irrigation scheduling & weather sync" },
  { icon: "📦", text: "Order management & live tracking" },
];

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-bg">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
        </div>
        <div className="about-hero-content">
          <div className="hero-badge">
            <i className="fas fa-leaf" />
            <span>About the Project</span>
          </div>
          <h1>Smart Farming 360</h1>
          <p>
            A full-stack agricultural platform connecting Ghana's farmers, consumers,
            and agricultural officers — empowering local communities through technology.
          </p>
        </div>
      </section>

      {/* What it is */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-card about-what">
            <div className="about-section-tag">The Platform</div>
            <h2>What is Smart Farming 360?</h2>
            <p>
              Smart Farming 360 is a modern agri-tech platform designed specifically for Ghana's agricultural sector.
              It bridges the gap between smallholder farmers and consumers by eliminating middlemen, providing accurate
              localized weather data, and connecting farmers with certified agricultural extension officers.
            </p>
            <p>
              The platform covers all <strong>16 administrative regions of Ghana</strong> and delivers tailored features for
              four core roles: <strong>Farmers</strong>, <strong>Consumers</strong>,{" "}
              <strong>Agricultural Extension Officers</strong>, and <strong>Platform Administrators</strong>.
            </p>
          </div>

          {/* Features */}
          <div className="about-features-grid">
            {features.map((f, i) => (
              <div className="about-feature-pill" key={i}>
                <span className="pill-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="about-section about-section-alt">
        <div className="about-container">
          <div className="about-section-tag center">Leadership</div>
          <h2 className="center-heading">Our Team</h2>
          <p className="team-intro">
            Meet the leadership team driving innovation, operations, technology, and commercial growth.
          </p>
          <div className="team-grid">
            {teamMembers.map((m, i) => (
              <div className="team-card" key={i}>
                <div className="team-avatar-wrap">
                  <div className="team-avatar" style={{ background: m.avatarBg }}>
                    {m.initials}
                  </div>
                  <div className="team-role-icon" title={m.role}>
                    <i className={`fas ${m.icon}`} />
                  </div>
                </div>
                <h3 className="team-name">{m.name}</h3>
                <div className="team-role-badge">{m.role}</div>
                <p className="team-bio">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-section-tag center">Architecture</div>
          <h2 className="center-heading">Technology Stack</h2>
          <p className="team-intro">
            Engineered with modern, production-grade tools for speed, security, and scalability.
          </p>
          <div className="tech-grid">
            {techStack.map((t, i) => (
              <div className="tech-card" key={i}>
                <div className="tech-card-header">
                  <span className="tech-icon">{t.icon}</span>
                  <span className="tech-cat-badge">{t.category}</span>
                </div>
                <h3 className="tech-name">{t.name}</h3>
                <p className="tech-desc">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-container">
          <div className="cta-content">
            <h2>Ready to transform your agricultural journey?</h2>
            <p>Explore the marketplace, consult with an agricultural officer, or register your farm today.</p>
            <div className="cta-buttons">
              <Link to="/shop" className="btn btn-primary btn-large">
                <i className="fas fa-shopping-bag" /> Browse Marketplace
              </Link>
              <Link to="/register" className="btn btn-secondary btn-large">
                <i className="fas fa-user-plus" /> Join the Community
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
