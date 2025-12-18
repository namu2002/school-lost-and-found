const express = require('express');
const router = express.Router();
const LostItem = require('../models/lostitem'); // CORRECTED: Lowercase 'l' to match filename
const { protect } = require('../middleware/authMiddleware'); // CORRECTED: Import 'protect' from middleware

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
// CORRECTED: Replaced 'auth.authenticate' with 'protect'
router.post('/', protect, async (req, res) => { 
    const item = new LostItem({
        type: req.body.type,
        itemName: req.body.itemName,
        location: req.body.location,
        date: req.body.date,
        description: req.body.description || '',
        contactName: req.body.contactName || '',
        contactEmail: req.body.contactEmail || '',
        contactPhone: req.body.contactPhone || '',
        status: 'lost'
    });

    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a lost item by ID (admin or security only)
// CORRECTED: Replaced 'auth.authenticate' with 'protect'
router.delete('/:id', protect, async (req, res) => { 
    try {
        // This logic checks the user's role AFTER the 'protect' middleware confirms they are logged in.
        // req.user is added by the 'protect' middleware.
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