// app.js
const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config(); // load .env for DB credentials

// Import routes
const indexRoutes = require("./routes/indexRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

// ==================
// Body parser (before session)
// ==================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ==================
// MySQL session store
// ==================
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
    secret: "unibridge_secret_key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 },
  })
);

// ==================
// View engine
// ==================
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// ==================
// Static folders
// ==================
app.use(express.static("static"));
app.use(express.static(path.join(__dirname, "public")));

// ==================
// Make logged-in user available everywhere
// ==================
app.use((req, res, next) => {
  if (req.session.user) {
    req.user = req.session.user;
  }
  next();
});

// ==================
// Routes (order matters)
// ==================
app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.use("/profile", profileRoutes);

// ==================
// Start server
// ==================
const PORT = 3000; // inside container
const BROWSER_PORT = 3001; // mapped in Docker

app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${BROWSER_PORT}/`);
});