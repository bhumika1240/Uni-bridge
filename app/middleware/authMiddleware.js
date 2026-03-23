// middleware/authMiddleware.js
// Protect routes from unauthorized access

function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  req.user = req.session.user;
  next();
}

module.exports = requireLogin;