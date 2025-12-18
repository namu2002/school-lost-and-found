// server/models/Item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  status: { type: String, enum: ['lost', 'found'], required: true },
  type: { type: String, default: 'other' },
  name: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date },
  description: { type: String },
  contactName: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String },
  dateReported: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
