const express = require("express");
const {
  generateBonusCode,
  getAllBonusCodes,
  toggleBonusCodeStatus,
  applyBonusCode,
  bonusHistory,
} = require("../controller/BonusController");

const router = express.Router();

router.post("/generate", generateBonusCode);
router.get("/all", getAllBonusCodes);
router.post("/toggle", toggleBonusCodeStatus);
router.post("/apply", applyBonusCode);
router.get("/investors/:investorId/bonus-history", bonusHistory);

module.exports = router;
