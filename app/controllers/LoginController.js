// controllers/loginController.js
const User = require("../models/User"); // Your user model

class LoginController {
  // Show login page
  showLogin(req, res) {
    res.render("login"); // uses your login.pug
  }

  // Handle login POST
  async login(req, res) {
    const { email, password } = req.body;

    try {
      // Look up user in DB
      const user = await User.findOne({ email }); // adjust based on your DB

      if (!user) {
        return res.render("login", { error: "Invalid email or password" });
      }

      // Compare password (use bcrypt if passwords are hashed)
      const isMatch = await user.comparePassword(password); // your model should handle this
      if (!isMatch) {
        return res.render("login", { error: "Invalid email or password" });
      }

      // ✅ Set user in session (store only plain data, not full model)
      req.session.user = {
        id: user.id,
        email: user.email,
        // optional: include other safe info if needed
        // name: user.name
      };

      // 🔎 Debug log to confirm session is set
      console.log("LOGIN SESSION:", req.session);

      res.redirect("/dashboard"); // redirect to dashboard
    } catch (err) {
      console.error(err);
      res.render("login", { error: "Something went wrong" });
    }
  }

  // Logout
  logout(req, res) {
    req.session.destroy((err) => {
      if (err) return res.redirect("/dashboard");
      res.clearCookie("connect.sid");
      res.redirect("/login");
    });
  }
}

module.exports = new LoginController();