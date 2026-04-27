/**
 * UNI-BRIDGE MAIN APPLICATION FILE
 * Handles Middleware, Sessions, View Engine, and Routing
 */

const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
require("dotenv").config(); 

// --- 1. INITIALIZE APP ---
const app = express();

// --- 2. DATA PARSING MIDDLEWARE ---
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// --- 3. STATIC FILE SERVING ---
const staticPath = path.join(__dirname, "../static"); // Create a variable to keep it consistent
app.use(express.static(staticPath));
app.use("/uploads", express.static(path.join(staticPath, "uploads")));

// Ensure the upload directory exists inside STATIC, not public
const uploadDir = path.join(staticPath, "uploads"); 
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// --- 4. VIEW ENGINE SETUP ---
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// --- 5. SESSION STORAGE (MySQL) ---
const dbOptions = {
  host: process.env.DB_HOST || "db",
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};
const sessionStore = new MySQLStore(dbOptions);

app.use(
  session({
    key: "unibridge.sid",
    secret: process.env.SESSION_SECRET || "unibridge_secret_key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { 
      httpOnly: true,
      secure: false, 
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    },
  })
);

// --- 6. GLOBAL TEMPLATE VARIABLES ---
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.query = req.query; 
  next();
});

// --- 7. ROUTE IMPORTS ---
const indexRoutes = require("./routes/indexRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const profileRoutes = require("./routes/profileRoutes"); // ✅ ADDED: Import Profile Routes

// --- 8. ROUTE DEFINITIONS ---
app.use("/", indexRoutes);     // Home, About
app.use("/", authRoutes);      // Login, Signup, Logout
app.use("/", dashboardRoutes); // Dashboard, My Swaps, Messaging, etc.
app.use("/profile", profileRoutes); // ✅ FIXED: Mount Profile routes at /profile

// --- 9. 404 ERROR HANDLING ---
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

// --- 10. SERVER STARTUP ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`-----------------------------------------`);
  console.log(`✅ UNI-BRIDGE SERVER STARTED SUCCESSFULLY`);
  console.log(`📡 Internal Port: ${PORT}`);
  console.log(`🚀 Access via: http://localhost:${PORT}`); // Changed this
  console.log(`-----------------------------------------`);
});
module.exports = app;