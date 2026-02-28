// models/User.js
const db = require("../services/db");

class User {
  constructor({ id, firstname, lastname, dob, gender, email, password }) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.dob = dob;
    this.gender = gender;
    this.email = email;
    this.password = password;
  }

  // Save new user (signup)
  async save() {
    const sql = `INSERT INTO users 
      (firstname, lastname, dob, gender, email, password)
      VALUES (?, ?, ?, ?, ?, ?)`;

    const result = await db.query(sql, [
      this.firstname,
      this.lastname,
      this.dob,
      this.gender,
      this.email,
      this.password,
    ]);

    this.id = result.insertId;
    return result;
  }

  // Find user by email (login)
  static async findByEmail(email) {
    const sql = "SELECT * FROM users WHERE email = ?";
    const results = await db.query(sql, [email]);
    if (results.length === 0) return null;

    return new User(results[0]);
  }

  // Find user by ID
  static async findById(id) {
    const sql = "SELECT * FROM users WHERE id = ?";
    const results = await db.query(sql, [id]);
    if (results.length === 0) return null;

    return new User(results[0]);
  }
}

module.exports = User;