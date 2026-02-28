// controllers/loginController.js
const bcrypt = require("bcrypt");
const db = require("../config/db"); // adjust path to your db file

class LoginController {

  showLogin(req, res) {
    res.render("login");
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const users = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (users.length === 0) {
        return res.render("login", { error: "Invalid email or password" });
      }

      const user = users[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.render("login", { error: "Invalid email or password" });
      }

      req.session.user = {
        id: user.id,
        email: user.email,
      };

      console.log("LOGIN SUCCESS:", req.session.user);

      res.redirect("/dashboard");

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      res.render("login", { error: "Login error" });
    }
  }

  logout(req, res) {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/login");
    });
  }
}

module.exports = new LoginController();