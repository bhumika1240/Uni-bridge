// controllers/profileController.js
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * ProfileController
 * Handles profile viewing, editing, and picture upload
 */
class ProfileController {
  // --- Multer setup for profile picture uploads ---
  static uploadMiddleware() {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, "../static/uploads");
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // unique filename
      },
    });
    return multer({ storage }).single("profilePicture");
  }

  /**
   * Display the profile page
   * @param {Request} req
   * @param {Response} res
   */
  static async showProfile(req, res) {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send("User not found");

    res.render("profile", { user });
  }

  /**
   * Handle profile picture upload
   * @param {Request} req
   * @param {Response} res
   */
  static async uploadPicture(req, res) {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send("User not found");

    if (req.file) {
      // Delete old profile picture if it exists and is not default
      if (user.profilePicture && user.profilePicture !== "/images/default-avatar.png") {
        const oldPath = path.join(__dirname, "../static", user.profilePicture);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      user.profilePicture = `/uploads/${req.file.filename}`;
      await user.updateProfile();
    }

    res.redirect(`/profile/${user.id}`);
  }

  /**
   * Save profile edits (skills, availability)
   * @param {Request} req
   * @param {Response} res
   */
  static async saveProfile(req, res) {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send("User not found");

    // Update skills
    user.skills = req.body.skills || "";

    // Update availability (checkboxes may send single string if one day selected)
    let availability = req.body.availability || [];
    if (!Array.isArray(availability)) availability = [availability];
    user.availability = availability;

    await user.updateProfile();

    res.redirect(`/profile/${user.id}`);
  }
}

module.exports = ProfileController;