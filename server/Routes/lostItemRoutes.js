const express = require('express');
const router = express.Router();
const LostItem = require('../models/LostItem');
const auth = require('../authRoutes');

// GET all lost items
router.get('/', async (req, res) => {
    try {
        const items = await LostItem.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a lost item (authenticated users only)
router.post('/', auth.authenticate, async (req, res) => {
    const item = new LostItem({
        type: req.body.type,
        itemName: req.body.itemName,      // matches schema
        location: req.body.location,      // matches schema
        date: req.body.date,              // matches schema
        description: req.body.description || '',
        contactName: req.body.contactName || '',
        contactEmail: req.body.contactEmail || '',
        contactPhone: req.body.contactPhone || '',
        status: 'lost'                    // forced lost status
    });

    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a lost item by ID (admin or security only)
router.delete('/:id', auth.authenticate, async (req, res) => {
    try {
        // Only admin or security staff can delete items
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
