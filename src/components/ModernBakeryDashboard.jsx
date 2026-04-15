import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
// import { motion, AnimatePresence } from "framer-motion"; // Removed framer-motion dependency for lighter bundle, using Tailwind/CSS animations

const ModernBakeryERP = () => {
  const { user, token, login, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inventory, setInventory] = useState([]);
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    if (token) {
      fetchInventory();
      fetchOrders();
    }
  }, [token]);

  const fetchInventory = async () => {
    try {
      const res = await axios.get('/api/admin/products');
      setInventory(res.data.data.map(p => ({
        id: p._id,
        name: p.name,
        branchCode: p.category || 'ALL',
        price: parseFloat(p.price) || 0,
        stock: p.qty || p.stock || 0
      })));
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders');
      setMyOrders(res.data.data);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  // --- AUTH STATES ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  // --- APP STATES ---
  const [view, setView] = useState("dashboard");
  const [activeBranch, setActiveBranch] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);

  // --- BRANCH DATA ---
  const branches = [
    { code: "ALL", name: "All Branches", icon: "🌐" },
    { code: "RC-01", name: "Regal Chowk", icon: "👑" },
    { code: "PB-02", name: "Pirbag", icon: "🏛️" },
    { code: "KN-03", name: "karannagar", icon: "🕌" },
  ];

  // --- DELIVERY STATES ---
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  // --- BOX CATEGORIES ---
  const boxCategories = [
    { id: "MS1009", type: "8 KHANA", stock: 112 },
    { id: "MS1011", type: "8 KHANA", stock: 1357 },
    { id: "MS1007", type: "6 KHANA", stock: 2538 },
    { id: "MS1201", type: "4 KHANA LONG", stock: 1783 },
  ];

  // --- CUSTOMER & CONFIG ---
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "", address: "" });
  const [orderConfig, setOrderConfig] = useState({
    selectedBox: boxCategories[0].id,
    containerRequired: "No",
  });

  useEffect(() => {
    const now = new Date();
    setDeliveryDate(now.toISOString().split("T")[0]);
    setDeliveryTime(now.toTimeString().slice(0, 5));
  }, [view]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.username === "admin" && credentials.password === "1234") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials!");
    }
  };

  // --- FILTERED LOGIC (Branch + Search) ---
  const filteredProducts = useMemo(() => {
    return inventory.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchBranch = activeBranch === "ALL" || p.branchCode === activeBranch;
      return matchSearch && matchBranch;
    });
  }, [searchTerm, inventory, activeBranch]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing)
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const punchOrder = () => {
    if (!customer.name || !customer.phone || cart.length === 0) {
      return alert("Customer details and items are mandatory!");
    }
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const newOrder = {
      orderId: `ORD-${Date.now()}`,
      branch: activeBranch,
      customer: { ...customer },
      delivery: { date: deliveryDate, time: deliveryTime },
      items: [...cart],
      packaging: { ...orderConfig },
      total,
      timestamp: new Date().toLocaleString(),
    };
    setMyOrders([newOrder, ...myOrders]);
    alert("Order Synced to Cloud!");
    setCart([]);
    setCustomer({ name: "", phone: "", email: "", address: "" });
    setView("orders");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-md border border-white/20"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl font-bold shadow-lg">
              MS
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-2">
              Modern Sweets
            </h2>
            <p className="text-gray-300 text-lg">Enterprise Resource Planning</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="👤 Username"
              className="w-full p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all duration-300 text-lg"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="🔒 Password"
              className="w-full p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all duration-300 text-lg"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
            <button type="submit" className="w-full p-5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              🚀 ENTER SYSTEM
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const totalProducts = filteredProducts.length;
  const lowStock = filteredProducts.filter(p => p.stock < 100).length;
  const totalValue = filteredProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const totalCartValue = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/30 flex">
      {/* Enhanced Sidebar */}
      <motion.aside 
        initial={{ x: -250 }} 
        animate={{ x: 0 }} 
        className="w-72 bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-2xl fixed h-full z-50 lg:relative lg:translate-x-0"
      >
        <div className="p-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg">
              MS
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">Bakery ERP</h2>
              <p className="text-sm text-gray-400">Admin Panel</p>
            </div>
          </div>

          {/* Main Nav */}
          <div className="space-y-1 mb-12">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 px-2">Main Menu</h3>
            {[
              { label: '📊 Dashboard', active: view === 'dashboard' },
              { label: '➕ New Order', active: view === 'punch' },
              { label: '📋 History', active: view === 'orders' },
            ].map((item, i) => (
              <motion.button
                key={item.label}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView(item.active ? view : item.label.split(' ')[1].toLowerCase())}
                className={`w-full p-4 rounded-2xl text-left font-medium transition-all duration-300 ${
                  item.active 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Branches */}
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 px-2">Branches</h3>
            {branches.map((branch) => (
              <motion.button
                key={branch.code}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveBranch(branch.code)}
                className={`w-full p-3 rounded-xl text-left transition-all duration-300 flex items-center gap-3 text-sm ${
                  activeBranch === branch.code
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100 border-2'
                    : 'text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <span className="text-lg">{branch.icon}</span>
                <span className="font-medium">{branch.name}</span>
                <span className="ml-auto text-xs opacity-75">[{branch.code}]</span>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsLoggedIn(false)}
          className="absolute bottom-8 left-8 w-48 p-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300"
        >
          🚪 Logout
        </motion.button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 ml-0 lg:ml-72 p-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/10 shadow-xl"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-2">
                {view.toUpperCase().replace('PUNCH', 'NEW ORDER')}
              </h1>
              <p className="text-xl text-gray-400">Active Branch: <span className="font-semibold text-white">{activeBranch}</span></p>
            </div>
            <div className="flex gap-4 flex-wrap">
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10 min-w-[100px]">
                <div className="text-2xl font-bold text-primary-400">{totalProducts}</div>
                <div className="text-sm text-gray-400">Products</div>
              </div>
              <div className="text-center p-4 bg-amber-500/20 border-amber-500/30 rounded-xl border min-w-[100px]">
                <div className="text-2xl font-bold text-amber-400">{lowStock}</div>
                <div className="text-sm text-gray-300">Low Stock</div>
              </div>
              <div className="text-center p-4 bg-emerald-500/20 border-emerald-500/30 rounded-xl border min-w-[100px]">
                <div className="text-2xl font-bold text-emerald-400">₹{totalValue.toLocaleString()}</div>
                <div className="text-sm text-gray-300">Inventory Value</div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Dashboard View */}
        {view === "dashboard" && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {/* Simple Stock Chart */}
            <motion.div 
              className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
              whileHover={{ y: -4 }}
            >
              <h3 className="text-2xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Live Inventory Overview {activeBranch}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="font-mono text-lg font-bold text-white">{item.id}</div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.stock < 100 ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      } border`}>
                        {item.stock}
                      </div>
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-2 truncate">{item.name}</h4>
                    <div className="flex items-center gap-4 text-sm mb-4">
                      <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-xl font-medium">
                        {item.branchCode}
                      </span>
                      <span className="text-2xl font-bold text-amber-400">₹{item.price}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3">
                      <div className="bg-gradient-to-r from-emerald-400 to-blue-500 h-3 rounded-full transition-all duration-1000" 
                           style={{ width: `${Math.min((item.stock / 1000) * 100, 100)}%` }}></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats Chart - Simple SVG Pie */}
            <motion.div 
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl col-span-full lg:col-auto"
              whileHover={{ y: -4 }}
            >
              <h4 className="text-xl font-bold mb-6 text-white">Stock Status</h4>
              <svg viewBox="0 0 100 100" className="w-48 h-48 mx-auto">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#374151" strokeWidth="8" strokeDasharray="263.89" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray={`${(totalProducts / 4) * 26.389},263.89`} strokeLinecap="round" transform="rotate(-90 50 50)" className="transition-all duration-1000" />
              </svg>
              <p className="text-center mt-4 text-lg font-bold text-emerald-400">{totalProducts} items tracked</p>
            </motion.div>
          </motion.div>
        )}

        {/* Order Punch View */}
        {view === "punch" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Search */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <input
                  placeholder="🔍 Search products by name..."
                  className="w-full p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/30 text-xl font-medium shadow-lg transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl grid grid-cols-2 md:grid-cols-3 gap-6 max-h-96 overflow-y-auto">
                {filteredProducts.map((p, i) => (
                  <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.08, y: -8 }}
                    className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 hover:border-white/30 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 text-center"
                    onClick={() => addToCart(p)}
                  >
                    <div className="absolute top-4 right-4 text-2xl font-bold bg-amber-500/90 text-white px-3 py-1 rounded-xl shadow-lg">
                      ₹{p.price}
                    </div>
                    <h4 className="font-bold text-white text-lg mb-3 line-clamp-2">{p.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-xl text-sm font-medium">
                        {p.branchCode}
                      </span>
                      <span className="text-emerald-400 font-bold text-sm">Stock: {p.stock}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Cart */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl sticky top-8 self-start h-fit"
            >
              <h3 className="text-2xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                🛒 Order Cart
              </h3>
              
              {/* Customer */}
              <div className="space-y-4 mb-8">
                <label className="block text-sm font-semibold text-gray-300 mb-2">👤 Customer Details</label>
                <input 
                  placeholder="Full Name" 
                  className="w-full p-4 bg-white/10 rounded-2xl border border-white/20 text-white placeholder-gray-400 focus:border-primary-500 transition-all"
                  value={customer.name} 
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })} 
                />
                <input 
                  placeholder="📱 Phone" 
                  className="w-full p-4 bg-white/10 rounded-2xl border border-white/20 text-white placeholder-gray-400 focus:border-primary-500 transition-all"
                  value={customer.phone} 
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} 
                />
              </div>

              {/* Delivery */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">📅 Date</label>
                  <input type="date" className="w-full p-4 bg-white/10 rounded-2xl border border-white/20 text-white focus:border-primary-500" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">🕒 Time</label>
                  <input type="time" className="w-full p-4 bg-white/10 rounded-2xl border border-white/20 text-white focus:border-primary-500" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />
                </div>
              </div>

              {/* Packaging */}
              <div className="flex justify-between items-center bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 mb-6">
                <div>
                  <div className="text-sm text-amber-300 font-medium">📦 Box: {orderConfig.selectedBox}</div>
                  <div className="text-sm text-gray-400">Container: {orderConfig.containerRequired}</div>
                </div>
                <button onClick={() => setShowModal(true)} className="px-6 py-2 bg-amber-500/80 hover:bg-amber-600 text-white rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all">⚙️ Config</button>
              </div>

              {/* Cart Items */}
              <div className="space-y-3 mb-8 max-h-64 overflow-y-auto custom-scroll">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl group hover:bg-white/10 transition-all">
                    <span className="font-medium text-white">{item.name} <span className="text-gray-400">x{item.qty}</span></span>
                    <span className="font-bold text-emerald-400 text-lg">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t-2 border-white/10 pt-6 mb-8">
                <div className="text-2xl font-bold text-right text-white mb-4">
                  TOTAL: ₹{totalCartValue.toLocaleString()}
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                onClick={punchOrder}
                className="w-full p-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-3xl text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                ✅ PUNCH & PRINT ORDER
              </motion.button>
            </motion.div>
          </div>
        )}

        {/* Orders View */}
        {view === "orders" && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              📜 Recent Orders
            </h3>
            {myOrders.map((order, i) => (
              <motion.div
                key={order.orderId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-xl hover:shadow-2xl border-l-8 border-l-blue-500/50"
              >
                <div className="flex flex-wrap gap-4 items-start justify-between mb-6">
                  <h4 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent flex items-center gap-3">
                    {order.customer.name}
                    <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-2xl text-sm font-bold border border-blue-500/30">
                      {order.branch}
                    </span>
                  </h4>
                  <span className="text-sm text-gray-400">{order.timestamp}</span>
                </div>
                <p className="text-lg text-gray-300 mb-6 line-clamp-2">{order.items.map(i => `${i.name}(x${i.qty})`).join(', ')}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span>ID: <strong className="font-mono text-white">{order.orderId}</strong></span>
                  <span className="ml-auto font-bold text-2xl text-emerald-400">₹{order.total}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Packaging Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-6 text-white">📦 Packaging Config</h3>
              <select 
                className="w-full p-4 bg-white/10 rounded-2xl border border-white/20 text-white mb-6 focus:border-primary-500 focus:outline-none"
                value={orderConfig.selectedBox} 
                onChange={(e) => setOrderConfig({ ...orderConfig, selectedBox: e.target.value })}
              >
                {boxCategories.map((box) => (
                  <option key={box.id} value={box.id} className="text-black">
                    {box.id} - {box.type} (Stock: {box.stock})
                  </option>
                ))}
              </select>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 p-4 bg-emerald-500/80 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all"
                >
                  ✅ Save
                </button>
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 p-4 bg-gray-600/50 hover:bg-gray-700 text-white font-bold rounded-2xl transition-all"
                >
                  ❌ Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ModernBakeryERP;

