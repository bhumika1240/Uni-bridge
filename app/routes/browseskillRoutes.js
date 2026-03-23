const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/authMiddleware");
const BrowseskillController = require("../controllers/BrowseskillController");

router.post("/search", requireLogin, BrowseskillController.searchBySkill);

module.exports = router;