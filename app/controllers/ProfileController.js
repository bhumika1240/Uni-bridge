const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ProfileController = {
  // Multer setup for profile picture uploads
  uploadMiddleware: () => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        // Pointing to your static uploads folder
        const uploadDir = path.join(__dirname, "../public/uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
      }
    });
    return multer({ storage }).single("profilePicture");
  },

  // Show profile view
  showProfile: async (req, res) => {
    try {
      const email = req.session.user?.email;
      if (!email) return res.redirect("/login");

      const user = await User.findByEmail(email);
      if (!user) return res.status(404).send("User not found");

      res.render("profileView", { user });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },

  // Show profile edit
  showEditProfile: async (req, res) => {
    try {
      const email = req.session.user?.email;
      if (!email) return res.redirect("/login");

      const user = await User.findByEmail(email);
      if (!user) return res.status(404).send("User not found");

      res.render("profileEdit", { user });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },

  // Save profile edits (Skills and Availability)
  saveProfile: async (req, res) => {
    try {
      const email = req.session.user?.email;
      if (!email) return res.redirect("/login");

      const user = await User.findByEmail(email);
      if (!user) return res.status(404).send("User not found");

      // Handle Skills
      let skills = [];
      if (req.body.skills) {
        if (Array.isArray(req.body.skills)) {
          skills = req.body.skills.map(s => s.trim()).filter(Boolean);
        } else if (typeof req.body.skills === "string") {
          skills = req.body.skills.split(",").map(s => s.trim()).filter(Boolean);
        }
      }

      // Handle Availability
      const availability = [];
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      days.forEach(day => {
        if (req.body[`availability_day_${day}`]) {
          availability.push({
            day,
            from: req.body[`from_${day}`] || "09:00",
            to: req.body[`to_${day}`] || "17:00"
          });
        }
      });

      // Update the user profile in DB
      await user.updateProfile({ skills, availability });

      res.redirect("/profile/view");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },

  // Upload profile picture
  uploadPicture: async (req, res) => {
    try {
      const email = req.session.user?.email;
      if (!email) return res.redirect("/login");

      const user = await User.findByEmail(email);
      if (!user) return res.status(404).send("User not found");

      if (req.file) {
        // Delete old profile picture if it's not the default one
        if (user.profilePicture && !user.profilePicture.includes("default-avatar.png")) {
          const oldPath = path.join(__dirname, "../public", user.profilePicture);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        
        // Save new path to DB
        const newPath = `/uploads/${req.file.filename}`;
        await user.updateProfilePicture(newPath);
      }

      res.redirect("/profile/view");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
};

module.exports = ProfileController;