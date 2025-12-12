const mongoose = require('mongoose');

const lostitemSchema = new mongoose.Schema({
  type: { type: String, required: true },
  itemName: { type: String, required: true },  
  location: { type: String, required: true }, 
  date: { type: Date, required: true },

  description: String,

  contactName: String,
  contactEmail: String,
  contactPhone: String,

  status: { type: String, enum: ['lost', 'found'], default: 'lost' }
}, { timestamps: true });

module.exports = mongoose.model('LostItem', lostitemSchema);
