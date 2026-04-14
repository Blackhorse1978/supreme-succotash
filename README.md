# MERN Rebuild Complete

Clean standard MERN stack rebuilt:

## Backend (Node/Express/Mongo)
- cd backend
- cp ../.env.example .env (fill MONGO_URI/JWT_SECRET)
- npm i
- npm run dev (port 5001)

Test:
- http://localhost:5001/api/health
- http://localhost:5001/api-docs (Swagger)

## Frontend (React/Vite)
- npm i
- npm run dev (port 3000, proxy /api to backend)

App: Login/Register (admin/test / test), Dashboard CRUD products.

Backend routes: /api/auth (login/register), /api/products (GET/POST/PUT/DELETE auth protected).

Auth: JWT localStorage.

Ready! No bakery specific, generic products CRUD.

Ports open for checking.

