import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  const [form, setForm] = useState({ name: '', email: '', order: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name || !form.email) return;
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4500);
        setForm({ name: '', email: '', order: '', message: '' });
      } else {
        setError('Submit failed');
      }
    } catch (err) {
      setError('Submit error: ' + err.message);
    }
  };

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <header className="site-header">
            <div className="brand-group">
              <div className="brand-mark">MS</div>
              <div>
                <p className="brand-name">Modern Sweets</p>
                <p className="brand-tag">Bakery & MERN CRM</p>
              </div>
            </div>
            <nav className="site-nav">
              <a href="#menu">Menu</a>
              <Link to="/admin">Admin ERP</Link>
              <a href="#contact">Contact</a>
            </nav>
          </header>

          {/* Hero Section */}
          <main className="hero">
            <div className="hero-copy">
              <span className="eyebrow">Professional Bakery Experience</span>
              <h1>Handcrafted sweets, premium service, and modern outlet control.</h1>
              <p>
                Modern Sweets brings a refined bakery experience to Srinagar with three premium outlets and a
                factory hub in Khanmoo Industrial Area. Our site helps customers order fresh treats and
                keeps operations smooth across every location.
              </p>
              <div className="hero-actions">
                <a href="#menu" className="button button-primary">Explore Menu</a>
                <a href="#contact" className="button button-secondary">Book Catering</a>
              </div>
            </div>
            <div className="hero-visual">
              <img src="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80" alt="Modern bakery interior" />
              <div className="hero-stats">
                <div><strong>4</strong><span>Locations</span></div>
                <div><strong>98%</strong><span>Customer happiness</span></div>
                <div><strong>100+</strong><span>Fresh items weekly</span></div>
              </div>
            </div>
          </main>

          {/* Menu Section */}
          <section id="menu" className="section section-light">
            <div className="section-heading">
              <span className="eyebrow">Modern Sweets Menu</span>
              <h2>Modern Sweets Menu from MongoDB Backend</h2>
              <p>Live inventory from MongoDB. SWEETS, BAKERY, NAMKEEN (~85 items).</p>
            </div>
            <div className="menu-grid">
              {loading ? (
                <p>Loading products...</p>
              ) : error ? (
                <p className="error">{error}</p>
              ) : (
                products.map((item) => (
                  <article key={item._id || item.name} className="menu-card">
                    <h3>{item.name}</h3>
                    <p className="category">{item.category}</p>
                    <span className="price">{item.price || '₹299'}</span>
                  </article>
                ))
              )}
            </div>
          </section>

          {/* CRM Section */}
          <section id="crm" className="section section-dark">
            <div className="dashboard-copy">
              <span className="eyebrow">Outlet & CRM Control</span>
              <h2>4 Branches + Factory → Unified Dashboard</h2>
              <p>Regal Chowk, Karan Nagar, Pirbagh, Khanmoh Factory.</p>
              <div className="dashboard-features">
                <div><strong>JWT Auth</strong><p>Secure admin login</p></div>
                <div><strong>Real Orders</strong><p>MongoDB persistence</p></div>
                <div><strong>Live Inventory</strong><p>Multi-branch sync</p></div>
              </div>
            </div>
            <div className="contact-panel">
              <h3>Quick Inquiry</h3>
              <form onSubmit={handleSubmit} className="contact-form">
                <label>Name<input name="name" value={form.name} onChange={handleChange} placeholder="Your name" /></label>
                <label>Email<input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" /></label>
                <label>Order<input name="order" value={form.order} onChange={handleChange} placeholder="Custom cake or treats" /></label>
                <label>Message<textarea name="message" value={form.message} onChange={handleChange} /></label>
                <button type="submit" className="button button-primary">Submit</button>
                {submitted && <p className="success-note">Request received!</p>}
              </form>
            </div>
          </section>

          {/* Footer */}
          <section id="contact" className="section section-light footer-section">
            <div className="footer-copy">
              <h2>Our Outlets</h2>
            </div>
            <div className="footer-grid">
              <div><strong>Regal Chowk</strong><p>Shop 12, Srinagar</p></div>
              <div><strong>Karan Nagar</strong><p>Upper Karan Nagar</p></div>
              <div><strong>Pirbagh</strong><p>Pirbagh Market</p></div>
              <div><strong>Factory</strong><p>Khanmoh Industrial Area</p></div>
            </div>
            <div className="site-links">
              <p><a href="https://github.com/hp/supreme-succotash" target="_blank">GitHub</a> | Modern Sweets MERN CRM</p>
            </div>
          </section>

          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
