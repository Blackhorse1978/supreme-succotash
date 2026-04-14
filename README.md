# Modern Sweets Bakery - Production MERN Stack CRM

**Fullstack Bakery Management** | React + Vite | Express + MongoDB | JWT Auth | Multi-Branch

## 🎯 Features
| Public | Admin ERP |
|--------|-----------|
| Live menu from Mongo (~85 items) | JWT Auth (admin/1234) |
| Customer orders POST | Inventory dashboard (28+ items) |
| Responsive hero/menu/CRM | Punch orders → MongoDB |
| Vite proxy `/api` → backend:5001 | Branch filter (Regal Chowk/Pirbag/Karan Nagar) |
| **Production ready** (backend serves dist/) | Order history, packaging config |

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env: MONGO_URI=your_atlas_url, JWT_SECRET=your_secret
npm install
npm run dev  # http://localhost:5001
```

**Test APIs (Postman/curl):**
```
POST http://localhost:5001/api/auth/register {"username":"admin","password":"1234"}
POST http://localhost:5001/api/auth/login {"username":"admin","password":"1234"}  # Copy JWT
GET http://localhost:5001/api/products
POST http://localhost:5001/api/admin/orders  # Bearer TOKEN, test punch
```

### 2. Frontend
```bash
npm install
npm run dev  # http://localhost:5173 (proxies /api → 5001)
```

**Usage:**
- / → Public bakery site (Mongo menu)
- /admin → Login admin/1234 → Dashboard → Punch orders (persists!)

### 3. Production
```bash
npm run build  # creates /dist
cd backend
NODE_ENV=production npm start  # Serves frontend + APIs on 5001
```

## 🗄️ Database
**MongoDB Collections:**
- `products` (~85 real sweets/bakery auto-seed)
- `orders` (admin punches)
- `users` (JWT auth)

## 📱 Structure
```
supreme-succotash/
├── backend/           # Express + Mongoose
│   ├── models/        # User, Order
│   ├── routes/        # auth.js, orders.js
│   ├── server.js      # All APIs
│   └── .env.example
├── src/               # React + Vite
│   ├── contexts/      # AuthContext.jsx
│   ├── App.jsx        # AuthProvider + Routes
│   └── AdminDashboard.jsx  # Full ERP
└── package.json       # Frontend deps + proxy
```

## 🔧 Commands
```bash
# Concurrent dev (new terminal tabs)
backend: cd backend && npm run dev
frontend: npm run dev

# Test backend
curl http://localhost:5001/api/test

# Build prod
npm run build && cd backend && npm start
```

## 🎉 Status
✅ **Full MERN Rebuild Complete** - Bakery CRM Framework Ready  
**Live Demo:** Open `npm run dev` → /admin → login → punch orders!

**GitHub:** hp/supreme-succotash
