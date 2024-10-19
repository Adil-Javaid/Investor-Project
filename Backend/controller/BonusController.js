const BonusCode = require('../Schema/BoneSchema');
const Investor = require('../Schema/InvestorSchema');

exports.generateBonusCode = async (req, res) => {
  const { discountPercentage, expirationDate } = req.body;
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();

  const newBonus = new BonusCode({ code, discountPercentage, expirationDate });
  await newBonus.save();
  res.status(201).json({ message: 'Bonus code generated', code });
};

exports.getAllBonusCodes = async (req, res) => {
  const bonusCodes = await BonusCode.find();
  res.json(bonusCodes);
};

exports.toggleBonusCodeStatus = async (req, res) => {
  const { codeId, active } = req.body;
  await BonusCode.findByIdAndUpdate(codeId, { active });
  res.json({ message: `Bonus code ${active ? 'activated' : 'deactivated'}` });
};

exports.applyBonusCode = async (req, res) => {
  const { code, investorId, tokenAmount } = req.body;

  const bonusCode = await BonusCode.findOne({ code, active: true });

  if (!bonusCode) {
    return res.status(400).json({ message: "Invalid or inactive bonus code" });
  }

  const discount = tokenAmount * (bonusCode.discountPercentage / 100);
  const finalTokenAmount = tokenAmount - discount;

  const investor = await Investor.findById(investorId);
  if (!investor) {
    return res.status(404).json({ message: "Investor not found" });
  }

  investor.tokenPurchased += finalTokenAmount;
  investor.bonusCodesUsed.push(bonusCode._id);

  bonusCode.usedBy.push(investor._id);

  await investor.save();
  await bonusCode.save(); 

  res.json({ message: "Bonus applied", finalTokenAmount });
};

exports.bonusHistory = async (req, res) => {
  const { codeId } = req.params;
  const bonusCode = await BonusCode.findById(codeId).populate('usedBy');
  res.json(bonusCode);
};
