/**
 * browseskillRoutes.js
 * Handles searching and filtering for skills across the student database.
 */
const express = require("express");
const router = express.Router();

// ✅ FIX: Use destructuring { } to get the function from the middleware object
const { requireLogin } = require("../middleware/authMiddleware");

// Controller Import
const BrowseskillController = require("../controllers/BrowseskillController");

// --- ROUTES ---

/**
 * GET /browseskills
 * Displays the initial search page.
 */
router.get("/", requireLogin, (req, res) => BrowseskillController.viewSearch(req, res));

/**
 * POST /browseskills/search
 * Processes the search query and returns matching students.
 */
router.post("/search", requireLogin, (req, res) => BrowseskillController.searchBySkill(req, res));

module.exports = router;