const express = require("express");
const {
  generateBonusCode,
  getAllBonusCodes,
  toggleBonusCodeStatus,
  applyBonusCode,
  bonusHistory,
} = require("../controller/BonusController");




// Then use this middleware for your routes that require authentication

const router = express.Router();

router.post("/generate", generateBonusCode);
router.get("/all", getAllBonusCodes);
// router.post("/toggle", toggleBonusCodeStatus);
router.post("/apply", applyBonusCode);
router.get("/investors/:investorId/bonus-history", bonusHistory);
const AdminController = require("../controller/BonusController");
router.post("/admin/signup", AdminController.signupAdmin);



module.exports = router;
