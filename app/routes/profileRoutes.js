const express = require("express");
const router = express.Router();
const { requireLogin } = require("../middleware/authMiddleware"); 
const ProfileController = require("../controllers/ProfileController");

router.get("/view", requireLogin, (req, res) => ProfileController.showProfile(req, res));
router.get("/edit", requireLogin, (req, res) => ProfileController.showEditProfile(req, res));
router.post("/save", requireLogin, (req, res) => ProfileController.saveProfile(req, res));
router.post("/upload-picture", requireLogin, ProfileController.uploadMiddleware(), (req, res) => ProfileController.uploadPicture(req, res));

module.exports = router;