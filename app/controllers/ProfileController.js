const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ProfileController = {
  uploadMiddleware: () => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../public/uploads");
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
      }
    });
    return multer({ storage }).single("profilePicture");
  },

  showProfile: async (req, res) => {
    try {
      const email = req.session.user?.email;
      if (!email) return res.redirect("/login");
      const user = await User.findByEmail(email);
      if (!user) return res.status(404).send("User not found");
      
      // Ensure JSON strings are objects for Pug
      if (user.skills && typeof user.skills === 'string') user.skills = JSON.parse(user.skills);
      if (user.availability && typeof user.availability === 'string') user.availability = JSON.parse(user.availability);

      res.render("profileView", { user, title: "My Profile" });
    } catch (err) {
      console.error("Profile View Error:", err);
      res.status(500).send("Server error");
    }
  },

  showEditProfile: async (req, res) => {
    try {
      const email = req.session.user?.email;
      if (!email) return res.redirect("/login");
      const user = await User.findByEmail(email);
      if (!user) return res.status(404).send("User not found");

      if (user.skills && typeof user.skills === 'string') user.skills = JSON.parse(user.skills);
      if (user.availability && typeof user.availability === 'string') user.availability = JSON.parse(user.availability);

      res.render("profileEdit", { user, title: "Edit Profile" });
    } catch (err) {
      console.error("Edit Profile Error:", err);
      res.status(500).send("Server error");
    }
  },

  saveProfile: async (req, res) => {
    try {
      const email = req.session.user?.email;
      if (!email) return res.redirect("/login");
      const user = await User.findByEmail(email);
      if (!user) return res.status(404).send("User not found");

      let skills = [];
      if (req.body.skills) {
        skills = Array.isArray(req.body.skills) ? req.body.skills : [req.body.skills];
        skills = skills.map(s => s.trim()).filter(Boolean);
      }

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

      await user.updateProfile({ skills, availability });
      res.redirect("/profile/view");
    } catch (err) {
      console.error("Save Profile Error:", err);
      res.status(500).send("Server error");
    }
  },

  uploadPicture: async (req, res) => {
    try {
      const email = req.session.user?.email;
      if (!email) return res.redirect("/login");
      const user = await User.findByEmail(email);
      if (!user) return res.status(404).send("User not found");

      if (req.file) {
        const newPath = `/uploads/${req.file.filename}`;
        await user.updateProfilePicture(newPath);
        req.session.user.profilePicture = newPath;
      }
      res.redirect("/profile/view");
    } catch (err) {
      console.error("Upload Error:", err);
      res.status(500).send("Server error");
    }
  }
};

module.exports = ProfileController;