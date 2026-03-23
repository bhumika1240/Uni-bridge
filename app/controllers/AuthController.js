const User = require("../models/User");
const bcrypt = require("bcrypt");

// Export an object directly - this is the most reliable way for Express
module.exports = {
  showLogin: (req, res) => {
    res.render("login", { error: null });
  },

  login: async (req, res) => {
    try {
      const email = (req.body.email || "").trim();
      const password = req.body.password;
      const user = await User.findByEmail(email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.render("login", { error: "Invalid email or password" });
      }

      req.session.user = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role
      };
      res.redirect("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      res.render("login", { error: "Something went wrong" });
    }
  },

  showSignup: (req, res) => {
    res.render("signup", { error: null });
  },

  signup: async (req, res) => {
    try {
      const { firstname, lastname, dob, gender, email, password } = req.body;
      const existingUser = await User.findByEmail(email);
      if (existingUser) return res.render("signup", { error: "Email already exists" });

      const hashed = await bcrypt.hash(password, 10);
      const user = new User({ 
        firstname: firstname.trim(), 
        lastname: lastname.trim(), 
        dob, gender, email: email.trim(), 
        password: hashed 
      });
      await user.save();
      res.redirect("/login");
    } catch (err) {
      console.error("Signup error:", err);
      res.render("signup", { error: "Signup failed." });
    }
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout Error:", err);
      }
      res.clearCookie("unibridge.sid"); // Match the key from your app.js
      res.redirect("/login");
    });
  }
};