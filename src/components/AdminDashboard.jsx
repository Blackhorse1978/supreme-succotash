import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {  
  const { user, token, login, logout } = useAuth();
  const [credentials, setCredentials] = useState({ username: "admin", password: "1234" });
  const [isLoading, setIsLoading] = useState(false);

  const [view, setView] = useState("dashboard");
  const [activeBranch, setActiveBranch] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [myOrders, setMyOrders] = useState([]);

  const branches = [
    { code: "ALL", name: "All Branches" },
    { code: "RC-01", name: "Regal Chowk" },
    { code: "PB-02", name: "Pirbag" },
    { code: "LZ-03", name: "karannagar" },
  ];

  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  const boxCategories = [
    { id: "BX04", type: "4 KHANA", stock: 178 },
    { id: "BX06", type: "6 KHANA", stock: 253 },
    { id: "BX08", type: "8 KHANA", stock: 135 },
    { id: "BX08L", type: "8 KHANA LONG", stock: 89 },
  ];

  const [customer, setCustomer] = useState({ name: "", phone: "", email: "", address: "" });
  const [orderConfig, setOrderConfig] = useState({
    selectedBox: "BX04",
    containerRequired: "No",
  });

  useEffect(() => {
    const now = new Date();
    setDeliveryDate(now.toISOString().split("T")[0]);
    setDeliveryTime(now.toTimeString().slice(0, 5));
  }, []);

  const [inventory, setInventory] = useState([
    { id: "MS1601", name: "BROWN BREAD", branchCode: "RC-01", price: 45, stock: 200, category: "BAKERY EXEMPT", gst: "GST05" },
    // ... (keep existing 28+ items)
    { id: "MS4006", name: "TIKOON MUTHI", branchCode: "LZ-03", price: 130, stock: 350, category: "NAMKEEN", gst: "GST12" }
  ]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(credentials.username, credentials.password);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

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
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const punchOrder = async () => {
    if (!customer.name || !customer.phone || cart.length === 0) {
      alert("Customer details and items are mandatory!");
      return;
    }
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const orderData = {
      branch: activeBranch,
      customer,
      delivery: { date: deliveryDate, time: deliveryTime },
      items: cart,
      packaging: orderConfig,
      total
    };
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert("✅ Order punched & synced to MongoDB!");
      setMyOrders([data.order, ...myOrders]);
      setCart([]);
      setCustomer({ name: "", phone: "", email: "", address: "" });
      setView("orders");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setMyOrders(data);
    } catch (err) {
      console.error('Orders load error:', err);
    }
  }, [token]);

  useEffect(() => {
    if (user) loadOrders();
  }, [loadOrders, user]);

  if (!user || !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">Modern Sweets</h2>
            <p className="text-white/70 text-sm uppercase tracking-wider font-medium">JWT Auth ERP</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="admin"
                className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="1234"
                className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'ENTER SYSTEM'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Sidebar */}
      <nav className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 p-6 flex flex-col shadow-2xl">
        <div className="flex items-center gap-4 mb-10 p-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center font-bold text-xl text-slate-900 shadow-lg">MS</div>
          <div>
            <h2 className="text-xl font-bold text-white">Bakery ERP</h2>
            <p className="text-slate-400 text-sm font-medium">Modern Sweets</p>
          </div>
        </div>

        {/* Main Menu */}
        <div className="space-y-1 mb-10">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-3 px-2">Main Menu</p>
          <button
            className={`w-full p-3 rounded-xl text-left font-semibold transition-all duration-200 ${view === "dashboard" ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25" : "text-slate-300 hover:bg-slate-700 hover:text-white hover:shadow-md"}`}
            onClick={() => setView("dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            className={`w-full p-3 rounded-xl text-left font-semibold transition-all duration-200 ${view === "punch" ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25" : "text-slate-300 hover:bg-slate-700 hover:text-white hover:shadow-md"}`}
            onClick={() => setView("punch")}
          >
            ➕ New Order
          </button>
          <button
            className={`w-full p-3 rounded-xl text-left font-semibold transition-all duration-200 ${view === "orders" ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25" : "text-slate-300 hover:bg-slate-700 hover:text-white hover:shadow-md"}`}
            onClick={() => setView("orders")}
          >
            📋 History
          </button>
        </div>

        {/* Branches */}
        <div className="space-y-1 mb-auto">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-3 px-2">Branches</p>
          {branches.map((b) => (
            <button
              key={b.code}
              className={`w-full p-3 rounded-lg text-left text-sm font-medium transition-all duration-200 flex items-center gap-2 ${activeBranch === b.code ? "bg-emerald-500/20 border border-emerald-400 text-emerald-100 shadow-md" : "text-slate-400 hover:bg-slate-700 hover:text-slate-200 hover:border hover:border-slate-600"}`}
              onClick={() => setActiveBranch(b.code)}
            >
              <span className="text-xs opacity-75 font-mono">[ {b.code} ]</span> 
              {b.name}
            </button>
          ))}
        </div>

        <button 
          onClick={handleLogout}
          className="mt-auto p-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-2xl hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-red-500/30"
        >
          🚪 Logout ({user.username})
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="mb-8 pb-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold uppercase tracking-wide text-white flex items-center gap-3">
            {view.replace(/^\w/, c => c.toUpperCase())} 
            <span className="text-blue-400 text-lg font-mono">{activeBranch}</span>
          </h2>
        </header>

        {view === "dashboard" && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Live Inventory - {activeBranch}</h3>
              <p className="text-slate-400">Multi-branch stock dashboard</p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-800/50 border-b border-white/10">
                    <th className="p-4 text-left font-bold text-slate-300 uppercase tracking-wider text-xs">CODE</th>
                    <th className="p-4 text-left font-bold text-slate-300 uppercase tracking-wider text-xs">PRODUCT</th>
                    <th className="p-4 text-left font-bold text-slate-300 uppercase tracking-wider text-xs">CATEGORY</th>
                    <th className="p-4 text-left font-bold text-slate-300 uppercase tracking-wider text-xs">BRANCH</th>
                    <th className="p-4 text-left font-bold text-slate-300 uppercase tracking-wider text-xs">STOCK</th>
                    <th className="p-4 text-left font-bold text-slate-300 uppercase tracking-wider text-xs">RATE</th>
                    <th className="p-4 text-left font-bold text-slate-300 uppercase tracking-wider text-xs">GST</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((item) => (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono text-slate-300 text-sm">{item.id}</td>
                      <td className="p-4 font-semibold text-white max-w-xs truncate">{item.name}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold">{item.category}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-slate-600 text-slate-200 rounded-md text-xs font-mono">{item.branchCode}</span>
                      </td>
                      <td className={`p-4 font-bold text-lg ${item.stock < 100 ? "text-red-400" : "text-emerald-400"}`}>{item.stock}</td>
                      <td className="p-4 text-lg font-bold text-emerald-400">₹{item.price}</td>
                      <td className="p-4">
                        <span className="text-xs text-orange-400 font-mono">{item.gst}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === "punch" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full">
            <div className="lg:col-span-3">
              <div className="mb-6">
                <input
                  placeholder="🔍 Search items by name..."
                  className="w-full p-5 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300 text-lg backdrop-blur-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto pr-2">
                {filteredProducts.map((p) => (
                  <div 
                    key={p.id} 
                    className="group p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-400 relative backdrop-blur-xl"
                    onClick={() => addToCart(p)}
                  >
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">{`₹${p.price}`}</div>
                    <h4 className="font-bold text-white text-lg mb-2 group-hover:text-blue-400 transition-colors">{p.name}</h4>
                    <div className="text-xs text-slate-400 mb-2">{p.category} | <span className="font-mono">{p.branchCode}</span></div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400" style={{width: `${Math.min((p.stock/500)*100, 100)}%`}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl lg:max-h-screen lg:overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6 text-center bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Order Processing</h3>
              
              {/* Customer Info */}
              <div className="space-y-4 mb-6">
                <label className="block text-white font-bold text-sm uppercase tracking-wide">Customer Info</label>
                <input placeholder="Name" className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
                <input placeholder="Phone" className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
                <input placeholder="Email" className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
                <input placeholder="Address" className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
              </div>

              {/* Delivery */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-white font-bold text-sm uppercase tracking-wide mb-2">Delivery Date</label>
                  <input type="date" className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-white font-bold text-sm uppercase tracking-wide mb-2">Time</label>
                  <input type="time" className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />
                </div>
              </div>

              {/* Config */}
              <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-600 mb-6 flex justify-between items-center">
                <div className="space-y-1 text-sm text-slate-300">
                  <div>📦 BOX: <span className="font-bold">{orderConfig.selectedBox}</span></div>
                  <div>📦 CONT: <span className="font-bold">{orderConfig.containerRequired}</span></div>
                </div>
                <button onClick={() => setShowModal(true)} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all duration-200 text-sm shadow-md hover:shadow-lg">
                  EDIT
                </button>
              </div>

              {/* Cart Items */}
              <div className="max-h-52 overflow-y-auto mb-6 p-4 bg-slate-800/30 rounded-2xl border border-slate-600 space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                    <span className="text-white font-medium">
                      {item.name} <span className="text-slate-400 text-sm">x{item.qty}</span>
                    </span>
                    <strong className="text-emerald-400 text-lg">₹{item.price * item.qty}</strong>
                  </div>
                ))}
              </div>

              {/* Total & Punch */}
              <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 p-6 rounded-3xl mb-6">
                <div className="flex justify-between items-center text-2xl font-bold text-white mb-6">
                  <span>GRAND TOTAL</span>
                  <span>₹{cart.reduce((s, i) => s + i.price * i.qty, 0)}</span>
                </div>
                <button 
                  onClick={punchOrder}
                  className="w-full p-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl hover:from-emerald-600 hover:to-teal-600 transform hover:-translate-y-1 transition-all duration-300 border border-emerald-500/50"
                >
                  🎯 PUNCH & PRINT
                </button>
              </div>
            </div>
          </div>
        )}

        {view === "orders" && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-8 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Recent Transactions</h3>
            {myOrders.map((order) => (
              <div key={order.orderId} className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl hover:shadow-3xl hover:border-orange-400/50 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <strong className="text-xl text-white">{order.customer.name}</strong>
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm font-bold border border-orange-400/30">{order.branch}</span>
                  </div>
                  <span className="text-slate-400 text-sm font-mono">{new Date(order.timestamp).toLocaleString()}</span>
                </div>
                <div className="text-slate-300 mb-6 text-sm leading-relaxed max-h-20 overflow-y-auto">
                  Items: {order.items.map((i) => `${i.name}(x${i.qty})`).join(", ")}
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-white/10">
                  <span className="font-mono text-slate-400 text-sm">ID: {order.orderId}</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">₹{order.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl w-full max-w-md border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center bg-gradient-to-r from-slate-300 to-slate-100 bg-clip-text text-transparent">Packaging Config</h3>
              <select
                className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white mb-4 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                value={orderConfig.selectedBox}
                onChange={(e) => setOrderConfig({ ...orderConfig, selectedBox: e.target.value })}
              >
                {boxCategories.map((box) => (
                  <option key={box.id} value={box.id} className="bg-slate-800 text-white">
                    {box.id} - {box.type} (Stock: {box.stock})
                  </option>
                ))}
              </select>
              <label className="block text-white font-bold text-sm uppercase tracking-wide mb-2">Container Required</label>
              <select
                className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white mb-6 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                value={orderConfig.containerRequired}
                onChange={(e) => setOrderConfig({ ...orderConfig, containerRequired: e.target.value })}
              >
                <option value="No" className="bg-slate-800 text-white">No</option>
                <option value="Yes" className="bg-slate-800 text-white">Yes</option>
              </select>
              <button onClick={() => setShowModal(false)} className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                💾 Save Configuration
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
