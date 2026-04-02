const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = {
  showLogin: (req, res) => {
    // If user is already logged in, don't show login page, go to dashboard
    if (req.session.user) return res.redirect("/dashboard");
    res.render("login", { error: null });
  },

  login: async (req, res) => {
    try {
      const email = (req.body.email || "").trim();
      const password = req.body.password;
      const user = await User.findByEmail(email);

      // Check if user exists and password matches
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.render("login", { error: "Invalid email or password" });
      }

      // Store user info in session
      req.session.user = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role
      };

      // FIX: Manually save the session before redirecting.
      // This prevents the "log in twice" issue caused by race conditions in MySQLStore.
      req.session.save((err) => {
        if (err) {
          console.error("Session Save Error:", err);
          return res.render("login", { error: "Session failed to initialize" });
        }
        res.redirect("/dashboard");
      });
      
    } catch (err) {
      console.error("Login error:", err);
      res.render("login", { error: "Something went wrong during login" });
    }
  },

  showSignup: (req, res) => {
    res.render("signup", { error: null });
  },

  signup: async (req, res) => {
    try {
      const { firstname, lastname, dob, gender, email, password } = req.body;
      
      // Check if email is taken
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.render("signup", { error: "Email already exists" });
      }

      // Hash password and save new user
      const hashed = await bcrypt.hash(password, 10);
      const newUser = new User({ 
        firstname: (firstname || "").trim(), 
        lastname: (lastname || "").trim(), 
        dob, 
        gender, 
        email: (email || "").trim(), 
        password: hashed 
      });

      await newUser.save();
      
      // Redirect to login after successful signup
      res.redirect("/login");
    } catch (err) {
      console.error("Signup error:", err);
      res.render("signup", { error: "Signup failed. Please try again." });
    }
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout Error:", err);
      }
      res.clearCookie("unibridge.sid"); 
      res.redirect("/login");
    });
  }
};