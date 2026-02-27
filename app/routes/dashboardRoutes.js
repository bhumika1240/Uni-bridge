// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/authMiddleware"); 
const dashboardController = require("../controllers/DashboardController");

router.get("/dashboard", requireLogin, dashboardController.dashboard);
router.get("/profile", requireLogin, dashboardController.profile);
router.get("/myswaps", requireLogin, dashboardController.myswaps);
router.get("/browseskills", requireLogin, dashboardController.browseskills);
router.get("/messages", requireLogin, dashboardController.messages);
router.get("/settings", requireLogin, dashboardController.settings);

module.exports = router; // ✅ export router directly