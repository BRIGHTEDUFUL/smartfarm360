import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './AboutPage.css';

const AboutPage = () => {
  const stats = [
    { icon: '🌍', value: '16', label: 'Regions Covered' },
    { icon: '👨‍🌾', value: '1,250+', label: 'Active Farmers' },
    { icon: '🛒', value: '5,000+', label: 'Products Available' },
    { icon: '😊', value: '10,000+', label: 'Happy Customers' },
  ];

  const values = [
    {
      icon: '🌱',
      title: 'Sustainability',
      description: 'Supporting eco-friendly farming practices that protect Ghana\'s natural resources for future generations.',
    },
    {
      icon: '🤝',
      title: 'Fair Trade',
      description: 'Ensuring farmers receive fair prices for their produce while consumers get quality products at great value.',
    },
    {
      icon: '💚',
      title: 'Community First',
      description: 'Building strong connections between farmers and consumers across all 16 regions of Ghana.',
    },
    {
      icon: '✨',
      title: 'Quality Assured',
      description: 'Every product is verified for freshness and quality before reaching your doorstep.',
    },
  ];

  const team = [
    {
      name: 'Kwame Asante',
      role: 'Founder & CEO',
      image: '👨🏿‍💼',
      bio: 'Agricultural economist passionate about connecting farmers to markets.',
    },
    {
      name: 'Ama Osei',
      role: 'Head of Operations',
      image: '👩🏿‍💼',
      bio: 'Logistics expert ensuring fresh products reach customers on time.',
    },
    {
      name: 'Kofi Mensah',
      role: 'Farmer Relations',
      image: '👨🏿‍🌾',
      bio: 'Former farmer helping others succeed in the digital marketplace.',
    },
  ];

  return (
    <div>
      <Navbar />
      
      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-bg">
            <div className="hero-orb orb-1"></div>
            <div className="hero-orb orb-2"></div>
          </div>
          <div className="about-hero-content">
            <div className="hero-badge">
              <i className="fas fa-leaf"></i>
              <span>About Smart Farming 360</span>
            </div>
            <h1>Connecting Ghana's Farmers<br />to Your Table</h1>
            <p>
              We're revolutionizing agriculture in Ghana by creating a direct link between farmers 
              across all 16 regions and consumers nationwide. Fresh, fair, and sustainable.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="story-section">
          <div className="container">
            <div className="story-content">
              <div className="story-image">
                <img src="/images/about-farm.jpg" alt="Ghana Farm" />
                <div className="image-badge">
                  <i className="fas fa-heart"></i>
                  <span>Made in Ghana</span>
                </div>
              </div>
              <div className="story-text">
                <h2>Our Story</h2>
                <p>
                  Smart Farming 360 was born from a simple observation: Ghana's farmers produce 
                  incredible quality products, but struggle to reach consumers directly. Meanwhile, 
                  consumers want fresh, locally-sourced produce but don't know where to find it.
                </p>
                <p>
                  We bridge this gap by connecting farmers from all 16 regions of Ghana with 
                  consumers across the country. From the cocoa farms of Ashanti to the rice fields 
                  of Northern Region, from the pineapple plantations of Eastern Region to the 
                  vegetable gardens of Greater Accra - we bring Ghana's agricultural diversity 
                  to your doorstep.
                </p>
                <p>
                  Our platform ensures farmers get fair prices for their hard work while consumers 
                  enjoy fresh, quality products at competitive prices. It's a win-win that's 
                  transforming Ghana's agricultural landscape.
                </p>
                <Link to="/shop" className="btn btn-primary">
                  <i className="fas fa-shopping-bag"></i>
                  Start Shopping
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="container">
            <div className="section-header">
              <h2>Our Values</h2>
              <p>The principles that guide everything we do</p>
            </div>
            <div className="values-grid">
              {values.map((value, index) => (
                <div key={index} className="value-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="value-icon">{value.icon}</div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="container">
            <div className="section-header">
              <h2>Meet Our Team</h2>
              <p>The people making it all happen</p>
            </div>
            <div className="team-grid">
              {team.map((member, index) => (
                <div key={index} className="team-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="team-avatar">{member.image}</div>
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="impact-section">
          <div className="container">
            <div className="section-header">
              <h2>Our Impact</h2>
              <p>Making a difference across Ghana</p>
            </div>
            <div className="impact-grid">
              <div className="impact-card">
                <div className="impact-icon">🌾</div>
                <h3>Supporting Farmers</h3>
                <p>
                  Over 1,250 farmers across Ghana now have direct access to customers, 
                  earning 30% more than traditional market prices.
                </p>
              </div>
              <div className="impact-card">
                <div className="impact-icon">🚚</div>
                <h3>Fast Delivery</h3>
                <p>
                  Same-day delivery in major cities ensures products reach consumers 
                  at peak freshness, reducing waste by 40%.
                </p>
              </div>
              <div className="impact-card">
                <div className="impact-icon">🌍</div>
                <h3>Environmental Care</h3>
                <p>
                  Promoting sustainable farming practices and reducing carbon footprint 
                  through efficient logistics and local sourcing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta">
          <div className="container">
            <div className="cta-content">
              <h2>Join the Movement</h2>
              <p>Whether you're a farmer or a consumer, there's a place for you in our community</p>
              <div className="cta-buttons">
                <Link to="/register" className="btn btn-primary btn-large">
                  <i className="fas fa-user-plus"></i>
                  Become a Farmer
                </Link>
                <Link to="/shop" className="btn btn-secondary btn-large">
                  <i className="fas fa-shopping-bag"></i>
                  Start Shopping
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
