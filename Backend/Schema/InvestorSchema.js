const mongoose = require('mongoose');

const investorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bonusCodesUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BonusCode' }],
  tokenPurchased: Number,
});

module.exports = mongoose.model('Investor', investorSchema);
