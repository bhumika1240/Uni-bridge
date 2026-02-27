// routes/loginRoutes.js
const express = require("express");
const router = express.Router();
const loginController = require("../controllers/LoginController");

router.get("/login", loginController.showLogin.bind(loginController));
router.post("/login", loginController.login.bind(loginController));
router.get("/logout", loginController.logout.bind(loginController));

module.exports = router;
