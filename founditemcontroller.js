const FoundItem = require('../models/FoundItem');

// GET all found items
exports.getFoundItems = async (req, res) => {
    try {
        const items = await FoundItem.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// CREATE found item
exports.createFoundItem = async (req, res) => {
    const item = new FoundItem({
        type: req.body.type,
        name: req.body.name,
        location: req.body.location,
        date: req.body.date,
        description: req.body.description,
        contactName: req.body.contactName,
        contactEmail: req.body.contactEmail,
        contactPhone: req.body.contactPhone,
        status: 'found'
    });

    try {
        const savedItem = await item.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
