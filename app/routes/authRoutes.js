// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");

router.get("/login", authController.showLogin);
router.post("/login", authController.login);
router.get("/signup", authController.showSignup);
router.post("/signup", authController.signup);
router.get("/logout", authController.logout);

module.exports = router; // ✅ export router directly