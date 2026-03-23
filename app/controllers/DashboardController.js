const User = require("../models/User");

class DashboardController {
  // Helper to get full user data including skills/availability
  async getFullUser(req) {
    const email = req.session.user?.email;
    if (!email) return null;
    return await User.findByEmail(email);
  }

  // Dashboard page
  async dashboard(req, res) {
    const user = await this.getFullUser(req);
    if (!user) return res.redirect("/login");

    res.render("dashboard", { user });
  }

  // Profile page (The one that was crashing)
  async profile(req, res) {
    const user = await this.getFullUser(req);
    if (!user) return res.redirect("/login");

    // FIX: Changed "profile" to "profileView" to match your filename
    res.render("profileView", { user });
  }

  // My Swaps page
  async myswaps(req, res) {
    const user = await this.getFullUser(req);
    if (!user) return res.redirect("/login");

    res.render("myswaps", { user });
  }

  // Browse Skills page
  async browseskills(req, res) {
    const user = await this.getFullUser(req);
    if (!user) return res.redirect("/login");

    res.render("browseskills", { user });
  }

  // Messages page
  async messages(req, res) {
    const user = await this.getFullUser(req);
    if (!user) return res.redirect("/login");

    res.render("messages", { user });
  }

  // Settings page
  async settings(req, res) {
    const user = await this.getFullUser(req);
    if (!user) return res.redirect("/login");

    res.render("settings", { user });
  }
}

// Export as a new instance
module.exports = new DashboardController();