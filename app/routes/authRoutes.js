const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

// DEBUG: This will print in your Docker logs
console.log("Loaded AuthController keys:", Object.keys(AuthController || {}));

router.get("/login", AuthController.showLogin);
router.post("/login", AuthController.login);
router.get("/signup", AuthController.showSignup);
router.post("/signup", AuthController.signup);
router.get("/logout", AuthController.logout);

module.exports = router;