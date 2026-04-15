# Dual DB Framework (MySQL + MongoDB) with Express

## Overview
Implement switchable MySQL/ MongoDB backend for supreme-succotash bakery app. Proper linking via `DB_TYPE` env var.

## Information Gathered
- Existing: MongoDB (Mongoose) with User/Product/Order models
- Products data in `backend/data/full-products.js` (finished goods)
- Raw materials inventory data provided (user feedback - 200+ items like AJWAIN 8.43 KG, ALMOND SLICE 51.34 KG etc.)
- No MySQL, no RawMaterial model/route yet
- Express server ready for dual DB

## Plan
1. **Raw Materials Model/Route** (Mongo first)
   - Create `backend/models/RawMaterial.js`
   - Create `backend/routes/rawMaterials.js`
   - Seed from parsed inventory data

2. **Dependencies**
   - `mysql2`, `sequelize`

3. **Config** `backend/config/database.js`
   ```
   DB_TYPE=mongodb|mysql
   MYSQL_* vars
   ```

4. **Dynamic Models** `backend/models/index.js`

5. **MySQL Support**
   - Sequelize models/tables
   - Dual seed

## Steps (0/10)

**To seed raw materials**:
```
cd backend && npm run seed-raw
```

**Next**: Approve to implement RawMaterial model + parse inventory into seed data.
