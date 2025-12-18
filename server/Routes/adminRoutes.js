// This is the complete, corrected code for: server/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const authMiddleware = require('../middleware/authMiddleware'); // For checking login status
const adminMiddleware = require('../middleware/adminMiddleware'); // For checking admin role

// --- IMPORTANT: Use the middleware to protect all routes in this file ---
// Any request to /api/admin/... will first run authMiddleware, then adminMiddleware.
// If either one fails, the request will be blocked.
router.use(authMiddleware, adminMiddleware);


// --- ALL ADMIN API ENDPOINTS ---

/**
 * @route   GET /api/admin/all-items
 * @desc    Get all lost and found items for the admin dashboard
 */
router.get('/all-items', async (req, res) => {
    try {
        const lostItems = await LostItem.find().sort({ createdAt: -1 });
        const foundItems = await FoundItem.find().sort({ createdAt: -1 });
        res.json({ lostItems, foundItems });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   PUT /api/admin/approve/:itemType/:id
 * @desc    Approve an item so it becomes publicly visible
 */
router.put('/approve/:itemType/:id', async (req, res) => {
    try {
        const { itemType, id } = req.params;
        const Model = itemType === 'lost' ? LostItem : FoundItem;
        const item = await Model.findByIdAndUpdate(id, { isApproved: true }, { new: true });
        if (!item) return res.status(404).json({ msg: 'Item not found' });
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   PUT /api/admin/claim/:itemType/:id
 * @desc    Mark an item as "claimed"
 */
router.put('/claim/:itemType/:id', async (req, res) => {
    try {
        const { itemType, id } = req.params;
        const Model = itemType === 'lost' ? LostItem : FoundItem;
        const item = await Model.findByIdAndUpdate(id, { status: 'claimed' }, { new: true });
        if (!item) return res.status(404).json({ msg: 'Item not found' });
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   DELETE /api/admin/delete/:itemType/:id
 * @desc    Delete a lost or found item
 */
router.delete('/delete/:itemType/:id', async (req, res) => {
    try {
        const { itemType, id } = req.params;
        const Model = itemType === 'lost' ? LostItem : FoundItem;
        const item = await Model.findByIdAndDelete(id);
        if (!item) return res.status(404).json({ msg: 'Item not found' });
        res.json({ msg: 'Item removed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;