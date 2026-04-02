// middleware/authMiddleware.js

function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    req.user = req.session.user; 
    res.locals.user = req.session.user; // Accessible in all .pug files
    return next();
  }
  res.redirect("/login");
}

/**
 * NEW: Admin Authorization Middleware
 * Use this only on routes that should be restricted to Admins.
 */
function requireAdmin(req, res, next) {
  // Check if user is logged in AND has the 'admin' role
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  // If they are not admin, send a 403 Forbidden error
  res.status(403).send("Access Denied: You do not have permission to view this page.");
}

module.exports = { requireLogin, requireAdmin };