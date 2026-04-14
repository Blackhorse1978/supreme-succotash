const express = require('express');
const router = express.Router();
const { body, validationResult, param } = require('express-validator');
const auth = require('../middleware/auth');
const RawMaterial = require('../models/RawMaterial');

/**
 * @swagger
 * /api/admin/raw-materials:
 *   get:
 *     summary: Get raw materials inventory
 *     tags: [Raw Materials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of raw materials
 */
router.get('/', auth, async (req, res) => {
  try {
    const { category, lowStock, vendor, section } = req.query;
    let query = {};
    if (category) query.category = category;
    if (lowStock === 'true') query.qty = { $lt: query.minStock || 10 };
    if (vendor) query.supplier = { $regex: vendor, $options: 'i' };
    if (section) query.section = section;

    const rawMaterials = await RawMaterial.find(query).sort({ createdAt: -1 });
    res.json({ 
      success: true,
      data: rawMaterials,
      count: rawMaterials.length 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, [
  body('name').notEmpty(),
  body('unit').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array() });

  try {
    const rawMaterial = new RawMaterial(req.body);
    await rawMaterial.save();
    res.status(201).json({ success: true, data: rawMaterial });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', auth, [
  param('id').isMongoId(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array() });

  try {
    const rawMaterial = await RawMaterial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!rawMaterial) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, data: rawMaterial });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const rawMaterial = await RawMaterial.findByIdAndDelete(req.params.id);
    if (!rawMaterial) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

