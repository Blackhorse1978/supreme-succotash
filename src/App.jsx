import { useState } from 'react';
import './App.css';

const menuItems = [
  { name: 'Rose Chai Latte', description: 'Warm spiced latte infused with rose syrup and foam.', price: '₹195' },
  { name: 'Salted Caramel Tart', description: 'Buttery shortcrust with caramel and sea salt.', price: '₹220' },
  { name: 'Matcha Éclair', description: 'Light choux pastry filled with matcha cream and cardamom.', price: '₹185' },
  { name: 'Berry Crumble Bar', description: 'Fresh berries with crisp oats and brown sugar topping.', price: '₹160' },
];

function App() {
  const [form, setForm] = useState({ name: '', email: '', order: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name || !form.email) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4500);
    setForm({ name: '', email: '', order: '', message: '' });
  };

  return (
    <div className="App">
      <header className="site-header">
        <div className="brand-group">
          <div className="brand-mark">MS</div>
          <div>
            <p className="brand-name">Modern Sweets</p>
            <p className="brand-tag">Bakery & CRM</p>
          </div>
        </div>
        <nav className="site-nav">
          <a href="#menu">Menu</a>
          <a href="#crm">Dashboard</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

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
          <img
            src="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80"
            alt="Modern bakery interior"
          />
          <div className="hero-stats">
            <div>
              <strong>4</strong>
              <span>Locations</span>
            </div>
            <div>
              <strong>98%</strong>
              <span>Customer happiness</span>
            </div>
            <div>
              <strong>100+</strong>
              <span>Fresh items weekly</span>
            </div>
          </div>
        </div>
      </main>

      <section id="menu" className="section section-light">
        <div className="section-heading">
          <span className="eyebrow">Our Bestsellers</span>
          <h2>Crafted daily with premium ingredients</h2>
          <p>Discover our signature collection of modern bakery classics, designed for taste and elegance.</p>
        </div>

        <div className="menu-grid">
          {menuItems.map((item) => (
            <article key={item.name} className="menu-card">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <span className="price">{item.price}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="crm" className="section section-dark">
        <div className="dashboard-copy">
          <span className="eyebrow">Outlet & CRM Control</span>
          <h2>Manage Regal Chowk, Karan Nagar, Pirbagh & Khanmoo factory from one dashboard.</h2>
          <p>
            Our bakery platform combines customer care, order tracking, and multi-location operations into
            a single modern interface so every visit feels smooth and premium.
          </p>
          <div className="dashboard-features">
            <div>
              <strong>Includes</strong>
              <p>Real-time order flow, loyalty tracking, and production coordination.</p>
            </div>
            <div>
              <strong>Built for</strong>
              <p>Bakery teams, outlet managers and customer service staff.</p>
            </div>
            <div>
              <strong>Designed</strong>
              <p>For fast decisions, clear reporting, and modern bakery growth.</p>
            </div>
          </div>
        </div>

        <div className="contact-panel">
          <h3>Send a bakery inquiry</h3>
          <p>Tell us your order, event date or catering requirement and our team will connect with you.</p>
          <form onSubmit={handleSubmit} className="contact-form">
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </label>
            <label>
              Order details
              <input name="order" value={form.order} onChange={handleChange} placeholder="Your favorite treat or custom cake details" />
            </label>
            <label>
              Message
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Any special requests or delivery notes"
              />
            </label>
            <button type="submit" className="button button-primary">Submit Request</button>
            {submitted && <p className="success-note">Thank you — we have received your request.</p>}
          </form>
        </div>
      </section>

      <section id="contact" className="section section-light footer-section">
        <div className="footer-copy">
          <h2>Modern Sweets Outlets</h2>
          <p>Visit any of our locations or connect with us for catering and special orders.</p>
        </div>
        <div className="footer-grid">
          <div>
            <strong>Regal Chowk</strong>
            <p>Shop 12, Regal Chowk, Srinagar</p>
          </div>
          <div>
            <strong>Karan Nagar</strong>
            <p>Upper Karan Nagar, Srinagar</p>
          </div>
          <div>
            <strong>Pirbagh</strong>
            <p>Pirbagh Market, Srinagar</p>
          </div>
          <div>
            <strong>Factory</strong>
            <p>Khanmoo Industrial Area, Srinagar</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
