const express = require("express");
const router = express.Router();
const { requireLogin, requireAdmin } = require("../middleware/authMiddleware");

// --- Controllers ---
const DashboardController = require("../controllers/DashboardController");
const BrowseskillController = require("../controllers/BrowseskillController");
const AdminController = require("../controllers/AdminController");
const SwapController = require("../controllers/SwapController"); 
const MessageController = require("../controllers/MessageController");

// ==========================================
// 1. DASHBOARD
// ==========================================
router.get("/dashboard", requireLogin, (req, res) => DashboardController.dashboard(req, res));
router.get("/settings", requireLogin, (req, res) => DashboardController.settings(req, res));

// ==========================================
// 2. DISCOVERY (SEARCH)
// ==========================================
router.get("/browseskills", requireLogin, (req, res) => BrowseskillController.viewSearch(req, res));
router.post("/browseskills/search", requireLogin, (req, res) => BrowseskillController.searchBySkill(req, res));

// This handles viewing OTHER users. 
// Your own profile is handled in profileRoutes.js
router.get("/profile/user/:id", requireLogin, (req, res) => DashboardController.viewUserProfile(req, res));

// ==========================================
// 3. MESSAGING SYSTEM
// ==========================================
router.get("/messages", requireLogin, (req, res) => DashboardController.messages(req, res));
router.get("/chat/:id", requireLogin, (req, res) => MessageController.viewChat(req, res));
router.post("/chat/send", requireLogin, (req, res) => MessageController.sendMessage(req, res));

// ==========================================
// 4. SKILL SWAPS
// ==========================================
router.get("/myswaps", requireLogin, (req, res) => DashboardController.myswaps(req, res));
router.post("/swaps/create", requireLogin, (req, res) => SwapController.createSwap(req, res));
router.post("/swaps/action", requireLogin, (req, res) => SwapController.handleAction(req, res));

// ==========================================
// 5. ADMIN MANAGEMENT
// ==========================================
router.get("/admin/users", requireLogin, requireAdmin, (req, res) => AdminController.manageUsers(req, res));
router.post("/admin/delete/:id", requireLogin, requireAdmin, (req, res) => AdminController.deleteUser(req, res));
router.post("/admin/update/:id", requireLogin, requireAdmin, (req, res) => AdminController.updateUser(req, res));

module.exports = router;