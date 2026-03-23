const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/authMiddleware");
const dashboardController = require("../controllers/DashboardController");
const BrowseskillController = require("../controllers/BrowseskillController");

// Main Dashboard
router.get("/dashboard", requireLogin, (req, res) => dashboardController.dashboard(req, res));

// My Profile - Updated to match the '/profile/view' link in your Pug Sidebar
router.get("/profile/view", requireLogin, (req, res) => dashboardController.profile(req, res));

// Fallback for just '/profile' if needed
router.get("/profile", requireLogin, (req, res) => dashboardController.profile(req, res));

// My Swaps
router.get("/myswaps", requireLogin, (req, res) => dashboardController.myswaps(req, res));

// Browse Skills
router.get("/browseskills", requireLogin, BrowseskillController.viewSearch);

// Messages
router.get("/messages", requireLogin, (req, res) => dashboardController.messages(req, res));

// Settings
router.get("/settings", requireLogin, (req, res) => dashboardController.settings(req, res));

module.exports = router;