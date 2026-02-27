const bcrypt = require("bcrypt");
const User = require("../models/User");

class AuthController {

  showLogin(req, res) {
    res.render("login");
  }

  showSignup(req, res) {
    res.render("signup");
  }

  // ✅ REPLACE your old signup() with this one
  async signup(req, res) {
    const {
      firstname = null,
      lastname = null,
      dob = null,
      gender = null,
      email = null,
      password = null
    } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.send("All required fields must be filled");
    }

    try {
      const existing = await User.findByEmail(email);

      if (existing) {
        return res.send("Email already registered");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
       firstname,
       lastname,
       dob,
       gender,
       email,
       password: hashedPassword
     });
      await user.save();

      res.redirect("/");

    } catch (err) {
      console.error(err);
      res.status(500).send("Signup error");
    }
  }

  async login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);

    if (!user) {
      return res.send("Email not found");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.send("Incorrect password");
    }

    req.session.user = user.id;
    res.redirect("/dashboard");

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).send("Login error");
  }
}

  logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/");
    });
  }
}

module.exports = new AuthController();
