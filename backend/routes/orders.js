const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Order = require('../models/Order');

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get user orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ timestamp: -1 }).limit(50);
    res.json({ 
      success: true,
      data: orders,
      count: orders.length 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/admin/orders:
 *   post:
 *     summary: Create new order (punch)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               branch:
 *                 type: string
 *               customer:
 *                 type: object
 *               items:
 *                 type: array
 *               total:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created
 */

router.post('/', auth, [
  body('branch').notEmpty(),
  body('customer.name').notEmpty(),
  body('total').isFloat({ min: 0 }),
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
    const orderData = {
      ...req.body,
      userId: req.user._id,
      orderId: `ORD-${Date.now()}`
    };
    const order = new Order(orderData);
    await order.save();
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
