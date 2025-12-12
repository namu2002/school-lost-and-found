const mongoose = require('mongoose');

const founditemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  description: String,
  locationFound: String,
  dateFound: Date,
  imageUrl: String,
  finder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['unclaimed', 'claimed'], default: 'unclaimed' },
}, { timestamps: true });

module.exports = mongoose.model('founditem', founditemSchema);
