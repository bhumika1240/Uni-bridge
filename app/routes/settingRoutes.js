const express = require("express");
const router = express.Router();

const SettingController = require("../controllers/SettingController");
const requireLogin = require("../middleware/auth");

// ==========================
// GET: Show settings page
// ==========================
router.get("/", requireLogin, SettingController.viewSettings);

// ==========================
// POST: Update profile info
// ==========================
router.post("/update", requireLogin, SettingController.updateProfile);

// ==========================
// POST: Change password
// ==========================
router.post("/change-password", requireLogin, SettingController.changePassword);

// ==========================
// GET: Success page
// ==========================
router.get("/success", requireLogin, SettingController.showSuccess);

module.exports = router;