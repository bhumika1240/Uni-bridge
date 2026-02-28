require("dotenv").config(); // Load environment variables
const mysql = require("mysql2/promise");

/**
 * MySQL connection pool
 * Uses environment variables for security
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || "db",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "unibridge",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Test connection immediately
 */
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Connected Successfully");
    connection.release();
  } catch (err) {
    console.error("❌ MySQL Connection Failed:");
    console.error("Message:", err.message);
    console.error("Code:", err.code);
  }
})();

/**
 * Execute a query
 * @param {string} sql - SQL query string
 * @param {Array} params - Values for prepared statement
 * @returns {Promise<Array>} - Result rows
 */
async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

module.exports = { query };