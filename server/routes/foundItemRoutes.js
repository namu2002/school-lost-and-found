const express = require('express');
const router = express.Router();
// CORRECTED: Filename is 'lostitem.js' (lowercase) but we can name the variable as we wish.
// Note: You should consider having a single 'item.js' model instead of reusing 'lostitem'.
const LostItem = require('../models/lostitem');
const { protect } = require('../middleware/authMiddleware'); // CORRECTED: Import 'protect' from middleware

// GET all found items
router.get('/', async (req, res) => {
    try {
        // This correctly finds items from the collection that have a status of 'found'.
        const items = await LostItem.find({ status: 'found' });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a found item (authenticated users only)
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
        status: 'found' // forced found status
    });

    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a found item by ID (admin or security only)
// CORRECTED: Replaced 'auth.authenticate' with 'protect'
router.delete('/:id', protect, async (req, res) => {
    try {
        // The 'protect' middleware adds the 'req.user' object for this check.
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