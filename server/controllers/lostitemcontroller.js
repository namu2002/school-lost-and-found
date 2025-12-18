const LostItem = require('../models/LostItem');

// GET all lost items
exports.getLostItems = async (req, res) => {
    try {
        const items = await LostItem.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// CREATE lost item
exports.createLostItem = async (req, res) => {
    const item = new LostItem({
        type: req.body.type,
        name: req.body.name,
        location: req.body.location,
        date: req.body.date,
        description: req.body.description,
        contactName: req.body.contactName,
        contactEmail: req.body.contactEmail,
        contactPhone: req.body.contactPhone,
        status: 'lost'
    });

    try {
        const savedItem = await item.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
