// controllers/AuthController.js
const bcrypt = require("bcrypt");
const User = require("../models/User");

class AuthController {
  showLogin(req, res) {
    res.render("login");
  }

  showSignup(req, res) {
    res.render("signup");
  }

  // Signup
  async signup(req, res) {
    const { firstname, lastname, dob, gender, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.send("All required fields must be filled");
    }

    try {
      const existing = await User.findByEmail(email);
      if (existing) return res.send("Email already registered");

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        firstname,
        lastname,
        dob,
        gender,
        email,
        password: hashedPassword,
      });

      await user.save();

      req.session.user = { id: user.id, firstname: user.firstname, email: user.email };
      res.redirect("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).send("Signup error");
    }
  }

  // Login
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findByEmail(email);
      if (!user) return res.send("Email not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.send("Incorrect password");

      req.session.user = { id: user.id, firstname: user.firstname, email: user.email };
      res.redirect("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).send("Login error");
    }
  }

  // Logout
  logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/");
    });
  }
}

module.exports = new AuthController();