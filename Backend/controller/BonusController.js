const BonusCode = require('../Schema/BoneSchema');
const Investor = require('../Schema/InvestorSchema');

exports.generateBonusCode = async (req, res) => {
  const { discountPercentage, expirationDate, tokenPrice } = req.body;
  const count = discountPercentage;

  const generatedCodes = [];

  for (let i = 0; i < count; i++) {
    const code = Math.random().toString(36).substring(2, 18).toUpperCase();
    const token = Math.random().toString(36).substring(2, 18).toUpperCase();

    generatedCodes.push({
      code,
      token,
      discountPercentage,
      expirationDate,
      tokenPrice,
    });
  }

  await BonusCode.insertMany(generatedCodes);

  res.status(201).json({
    message: `${count} bonus codes generated`,
    codes: generatedCodes,
  });
};




exports.getAllBonusCodes = async (req, res) => {
  const currentDate = new Date();
  const bonusCodes = await BonusCode.find({
    expirationDate: { $gte: currentDate },
  })
    .populate("deactivatedBy", "name")
    .exec();

  res.json(bonusCodes);
};
exports.toggleBonusCodeStatus = async (req, res) => {
  const { codeId, active } = req.body;
  const userId = req.user._id;

  const bonusCode = await BonusCode.findByIdAndUpdate(
    codeId,
    {
      active,
      deactivatedBy: active ? null : userId,
    },
    { new: true }
  );

  if (!bonusCode) {
    return res.status(404).json({ message: "Bonus code not found" });
  }

  res.json({
    message: `Bonus code ${active ? "activated" : "deactivated"}`,
    deactivatedBy: active ? null : req.user.name,
  });
};



exports.applyBonusCode = async (req, res) => {
  try {
    const { investorId, code, tokenAmount } = req.body;

    if (!investorId || !code || tokenAmount <= 0) {
      return res
        .status(400)
        .json({
          message:
            "Invalid request. Ensure investorId, code, and valid tokenAmount are provided.",
        });
    }

    // Find investor by ID
    const investor = await Investor.findById(investorId);
    if (!investor) {
      return res.status(400).json({ message: "Investor not found." });
    }

    const bonusCode = await BonusCode.findOne({ code, active: true });
    if (!bonusCode) {
      return res
        .status(400)
        .json({ message: "Invalid or inactive bonus code." });
    }

    const discount =
      (bonusCode.tokenPrice * bonusCode.discountPercentage) / 100;
    const finalTokenAmount = tokenAmount - discount;

    // Update investor's purchased tokens and mark the bonus code as used
    investor.tokenPurchased += finalTokenAmount;
    investor.bonusCodesUsed.push(bonusCode._id);
    bonusCode.usedBy.push(investor._id);
    bonusCode.active = false;

    await investor.save();
    await bonusCode.save();

    res.json({ message: "Purchase successful", finalTokenAmount });
  } catch (error) {
    console.error("Error applying bonus code:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not apply bonus code." });
  }
};

exports.bonusHistory = async (req, res) => {
  const { codeId } = req.params;
  const bonusCode = await BonusCode.findById(codeId).populate(
    "usedBy",
    "name email"
  );
  res.json(bonusCode);
};
