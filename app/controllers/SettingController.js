// controllers/SettingController.js
// Handles account settings & password change

const User = require("../models/User");
const bcrypt = require("bcrypt");

class SettingController {

  static async viewSettings(req, res) {
    const user = await User.findById(req.user.id);
    res.render("settings", { user });
  }

  static async updateProfile(req, res) {
    const user = await User.findById(req.user.id);

    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.email = req.body.email;

    await user.updateBasicInfo();
    res.redirect("/settings");
  }

  static async changePassword(req, res) {
    const user = await User.findById(req.user.id);

    const match = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!match) return res.render("settings", { user, error: "Wrong password" });

    user.password = await bcrypt.hash(req.body.newPassword, 10);
    await user.updateBasicInfo();

    res.redirect("/settings");
  }
}

module.exports = SettingController;