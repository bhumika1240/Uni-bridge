// services/db.js
require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "db",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "uni-bridge",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL Connected Successfully");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL Connection Failed:", err.message);
  }
})();

/**
 * Execute SQL query
 * Use .query instead of .execute to support bulk inserts (nested arrays)
 */
async function query(sql, params = []) {
  try {
    // FIX: Changed .execute to .query
    const [result] = await pool.query(sql, params); 
    return result;
  } catch (err) {
    console.error("DB Query Error:", err.message);
    throw err;
  }
}

module.exports = { query, pool };