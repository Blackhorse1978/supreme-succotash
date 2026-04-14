# MERN Rebuild TODO
✅ Approved plan: Standard clean MERN stack (auth + products CRUD). Generic, remove bakery-specific. Full frontend dashboard with API integration. Open ports for checking.

## Steps (2/14 complete):
1. ✅ Create .env.example with MONGO_URI, JWT_SECRET.
2. ✅ Update backend/models/Product.js: Simplify schema to generic (name, description, price, category, stock).
3. Update backend/server.js: Simplify middleware, remove bakery data seed, ensure public /api/products GET, cors/proxy ready.
4. Update backend/routes/products.js: Generic CRUD, remove bakery fields.
5. Update backend/package.json: Ensure deps.
6. Frontend package.json: Add react-router-dom, axios, @tanstack/react-query (optional).
7. Update vite.config.js: Add proxy /api -> http://localhost:5001.
8. Create src/contexts/AuthContext.jsx: JWT auth context/provider.
9. Update src/App.jsx: Router layout (Login/Register/Products/Dashboard).
10. Update src/components/AdminDashboard.jsx: Products CRUD table/forms with API/axios.
11. Create src/pages/Login.jsx, Register.jsx, ProductsList.jsx, ProductForm.jsx.
12. Update src/index.css: Basic dashboard styles.
13. Update README.md: Run instructions (backend dev on 5001, frontend 3000).
14. Test: npm run dev both, register/login/products CRUD, ports open.

Next: Step 10. (Step 9 complete: src/App.jsx rebuilt as router dashboard - inline Login/Register/Protected/Dashboard, fetch API calls, styles)

