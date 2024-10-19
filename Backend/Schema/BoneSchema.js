const mongoose = require("mongoose");

const BonusCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discountPercentage: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    active: { type: Boolean, default: true },
    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Investor" }], // Reference to Investor
  },
  { timestamps: true }
);

module.exports = mongoose.model("BonusCode", BonusCodeSchema);
