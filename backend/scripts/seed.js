const mongoose = require('mongoose');
const { User, Product } = require('../models');
const { bakeryProducts } = require('../data/full-products');

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

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seedData();

