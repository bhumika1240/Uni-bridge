// controllers/DashboardController.js
class DashboardController {
  // Dashboard page
  dashboard(req, res) {
    // Optional: Ensure user is logged in
    if (!req.user) return res.redirect("/login");

    res.render("dashboard", { user: req.user });
  }

  // Profile page
  profile(req, res) {
    // Ensure user is logged in
    if (!req.user) return res.redirect("/login");

    // Pass logged-in user to profile template
    res.render("profile", { user: req.user });
  }

  // My Swaps page
  myswaps(req, res) {
    if (!req.user) return res.redirect("/login");

    res.render("myswaps", { user: req.user });
  }

  // Browse Skills page
  browseskills(req, res) {
    if (!req.user) return res.redirect("/login");

    res.render("browseskills", { user: req.user });
  }

  // Messages page
  messages(req, res) {
    if (!req.user) return res.redirect("/login");

    res.render("messages", { user: req.user });
  }

  // Settings page
  settings(req, res) {
    if (!req.user) return res.redirect("/login");

    res.render("settings", { user: req.user });
  }
}

module.exports = new DashboardController();