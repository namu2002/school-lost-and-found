const express = require('express');
const router = express.Router();
const LostItem = require('../models/LostItem'); // reuse the same schema, status changes to found
const auth = require('./authRoutes');

// GET all found items
router.get('/', async (req, res) => {
    try {
        const items = await LostItem.find({ status: 'found' }); // only found items
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a found item (authenticated users only)
router.post('/', auth.authenticate, async (req, res) => {
    const item = new LostItem({
        type: req.body.type,
        itemName: req.body.itemName,
        location: req.body.location,
        date: req.body.date,
        description: req.body.description || '',
        contactName: req.body.contactName || '',
        contactEmail: req.body.contactEmail || '',
        contactPhone: req.body.contactPhone || '',
        status: 'found'                    // forced found status
    });

    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a found item by ID (admin or security only)
router.delete('/:id', auth.authenticate, async (req, res) => {
    try {
        if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'security')) {
            return res.status(403).json({ message: 'Forbidden: insufficient privileges' });
        }

        const item = await LostItem.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ message: 'Item deleted successfully', item });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
