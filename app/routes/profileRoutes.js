// routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/authMiddleware");
const ProfileController = require("../controllers/ProfileController");

// Show read-only profile
router.get("/view", requireLogin, ProfileController.showProfile);

// Show profile edit page
router.get("/edit", requireLogin, ProfileController.showEditProfile);

// Save profile edits
router.post("/save", requireLogin, ProfileController.saveProfile);

// Upload profile picture
router.post(
  "/upload-picture",
  requireLogin,
  ProfileController.uploadMiddleware(),
  ProfileController.uploadPicture
);

module.exports = router;