const mongoose = require('mongoose');
const { User, Product, RawMaterial } = require('../models');
const { bakeryProducts } = require('../data/full-products');
const { rawMaterialsData } = require('../data/raw-materials-data');

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data (optional - comment out to append)
    // await User.deleteMany({});
    // await Product.deleteMany({});

    // Seed Admin User (if none exists)
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      const admin = new User({
        username: 'admin',
        password: 'admin123', // Will be hashed
        role: 'admin',
        branch: 'ALL'
      });
      await admin.save();
      console.log('✅ Admin user created: admin / admin123');
    }

    // Seed Products (only if empty)
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const productsData = bakeryProducts.slice(0, 50).map(p => ({
        name: p.NameToDisplay,
        qty: p['Curr.Qty'] || 0,
        groupName: p.GroupName,
        category: p.Category,
        hsncode: p.HSNCODE,
        unit1: p.Unit1,
        unit2: p.Unit2,
        salesTax: p.SalesTax,
        purchaseTax: p.PurchaseTax,
        price: '₹299' // Default
      }));
      await Product.insertMany(productsData);
      console.log(`✅ Seeded ${productsData.length} products`);
    } else {
      console.log(`ℹ️  ${productCount} products already exist, skipping seed`);
    }

    // Seed Raw Materials
    const rawCount = await RawMaterial.countDocuments();
    if (rawCount === 0) {
      const rawData = rawMaterialsData.map(item => ({
        name: item.name,
        qty: item.qty,
        unit: item.unit,
        supplier: item.vendor,
        expiry: new Date(item.date),
        section: item.section
      }));
      await RawMaterial.insertMany(rawData.slice(0, 50)); // First 50
      console.log(`✅ Seeded ${rawData.slice(0, 50).length} raw materials from ledger`);
    } else {
      console.log(`ℹ️  ${rawCount} raw materials exist, skipping`);
    }

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seedData();

