const express = require('express');
const router = express.Router();
const { body, validationResult, param } = require('express-validator');
const auth = require('../middleware/auth');
const Product = require('../models/Product');

/**
 * @swagger
 * /api/admin/products:
 *   get:
 *     summary: Get all products (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', auth, async (req, res) => {
  try {
    const { category, stock } = req.query;
    let query = {};
    if (category) query.category = category;
    if (stock === 'low') query.stock = { $lt: 10 };

    const products = await Product.find(query).sort({ createdAt: -1 }).limit(100);
    res.json({ 
      success: true,
      data: products,
      count: products.length 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/admin/products:
 *   post:
 *     summary: Create new product (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               category: { type: string }
 *               groupName: { type: string }
 *               qty: { type: number }
 *               price: { type: string }
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/', auth, [
  body('name').notEmpty().withMessage('Name required'),
  body('category').notEmpty(),
  body('price').isFloat({ min: 0 }).withMessage('Price must be positive number'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      error: 'Validation failed',
      details: errors.array() 
    });
  }

  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/admin/products/{id}:
 *   put:
 *     summary: Update product (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Product updated
 */
router.put('/:id', auth, [
  param('id').isMongoId(),
  body('name').optional().notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      error: 'Validation failed',
      details: errors.array() 
    });
  }

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { 
      new: true, 
      runValidators: true 
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/admin/products/{id}:
 *   delete:
 *     summary: Delete product (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete('/:id', auth, [
  param('id').isMongoId()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      error: 'Validation failed',
      details: errors.array() 
    });
  }

  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true, message: 'Product deleted', data: product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

