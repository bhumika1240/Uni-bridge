/**
 * AuthController.js
 * Handles User Authentication: Login, Signup, and Logout
 */

const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = {
  /**
   * GET /login
   * Renders the login page.
   * Redirects to dashboard if the user session already exists.
   */
  showLogin: (req, res) => {
    if (req.session.user) return res.redirect("/dashboard");
    res.render("login", { error: null });
  },

  /**
   * POST /login
   * Validates user credentials and initializes a session.
   */
  login: async (req, res) => {
    try {
      // 1. Sanitize and extract input
      const email = (req.body.email || "").trim();
      const password = req.body.password;

      // 2. Fetch user from database using the User Model
      const user = await User.findByEmail(email);

      // 3. Authentication Check: User existence & Password verification
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.render("login", { error: "Invalid email or password" });
      }

      // 4. Create Session Data: Only store non-sensitive info
      req.session.user = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role
      };

      /**
       * FIX: Session Race Condition
       * Since we use MySQLStore, we must wait for the database write 
       * to finish before redirecting to the dashboard.
       */
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

  /**
   * GET /signup
   * Renders the registration page.
   */
  showSignup: (req, res) => {
    res.render("signup", { error: null });
  },

  /**
   * POST /signup
   * Registers a new user into the system.
   */
  signup: async (req, res) => {
    try {
      const { firstname, lastname, dob, gender, email, password } = req.body;
      
      // 1. Uniqueness Check: Ensure email doesn't already exist
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.render("signup", { error: "Email already exists" });
      }

      // 2. Password Hashing: Encrypting the password before storage (Security best practice)
      const hashed = await bcrypt.hash(password, 10);
      
      // 3. Create new instance of User model
      const newUser = new User({ 
        firstname: (firstname || "").trim(), 
        lastname: (lastname || "").trim(), 
        dob, 
        gender, 
        email: (email || "").trim(), 
        password: hashed 
      });

      // 4. Persist user to MySQL database
      await newUser.save();
      
      // 5. Successful registration: Redirect to login
      res.redirect("/login");
    } catch (err) {
      console.error("Signup error:", err);
      res.render("signup", { error: "Signup failed. Please try again." });
    }
  },

  /**
   * GET /logout
   * Destroys the session and clears the client cookie.
   */
  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout Error:", err);
      }
      // Clear the cookie named 'unibridge.sid' as defined in app.js
      res.clearCookie("unibridge.sid"); 
      res.redirect("/login");
    });
  }
};