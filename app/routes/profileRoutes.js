// backend/profileRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");

// ===============================
// Multer Configuration
// ===============================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../public/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ===============================
// Middleware: Require Login
// ===============================
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

// ===============================
// GET: Profile Page
// ===============================
router.get("/", requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);

    if (!user) return res.redirect("/login");

    res.render("profile", { user });
  } catch (err) {
    console.error("Profile GET error:", err);
    res.redirect("/dashboard");
  }
});

// ===============================
// POST: Upload Profile Picture
// ===============================
router.post(
  "/upload",
  requireLogin,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const user = await User.findById(req.session.user.id);

      if (!user) return res.redirect("/login");

      if (req.file) {
        user.profilePicture = `/uploads/${req.file.filename}`;
      }

      await user.updateProfile();

      // 🔥 Update session with latest data
      req.session.user = user;

      res.redirect("/profile");
    } catch (err) {
      console.error("Upload error:", err);
      res.redirect("/profile");
    }
  }
);

// ===============================
// POST: Save Skills & Availability
// ===============================
router.post("/save", requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);

    if (!user) return res.redirect("/login");

    user.skills = req.body.skills || "";

    let availability = req.body.availability || [];
    if (!Array.isArray(availability)) {
      availability = [availability];
    }

    user.availability = availability;

    await user.updateProfile();

    // 🔥 Update session after DB update
    req.session.user = user;

    res.redirect("/profile");
  } catch (err) {
    console.error("Save profile error:", err);
    res.redirect("/profile");
  }
});

module.exports = router;