const db = require("../services/db");

/**
 * User Model
 * 
 * Handles both authentication (signup/login) and profile management.
 * Uses async/await for database operations.
 */
class User {
  /**
   * Constructor for creating a new user instance
   * @param {Object} params - User properties
   * @param {string} params.firstname
   * @param {string} params.lastname
   * @param {string} params.dob - Date of birth
   * @param {string} params.gender
   * @param {string} params.email
   * @param {string} params.password
   * @param {string} [params.profilePicture] - URL/path to profile picture
   * @param {string} [params.skills] - Comma-separated skills
   * @param {Array} [params.availability] - Array of weekdays
   */
  constructor({ id, firstname, lastname, dob, gender, email, password, profilePicture, skills, availability }) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.dob = dob;
    this.gender = gender;
    this.email = email;
    this.password = password;
    this.profilePicture = profilePicture || '/images/default-avatar.png';
    this.skills = skills || '';
    this.availability = availability || []; // array of weekdays
  }

  // -----------------------------------
  // --- Authentication Methods ---
  // -----------------------------------

  /**
   * Save a new user to the database (used for signup)
   */
  async save() {
    const sql = `INSERT INTO users 
      (firstname, lastname, dob, gender, email, password, profilePicture, skills, availability)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const availabilityStr = JSON.stringify(this.availability);

    const result = await db.query(sql, [
      this.firstname,
      this.lastname,
      this.dob,
      this.gender,
      this.email,
      this.password,
      this.profilePicture,
      this.skills,
      availabilityStr,
    ]);

    this.id = result.insertId; // store generated ID
    return result;
  }

  /**
   * Find a user by email (used for login)
   * @param {string} email
   * @returns {User|null}
   */
  static async findByEmail(email) {
    const sql = "SELECT * FROM users WHERE email = ?";
    const results = await db.query(sql, [email]);
    if (results.length === 0) return null;

    const user = results[0];
    user.availability = user.availability ? JSON.parse(user.availability) : [];
    return new User(user);
  }

  /**
   * Find a user by ID (used for profile display)
   * @param {number} id
   * @returns {User|null}
   */
  static async findById(id) {
    const sql = "SELECT * FROM users WHERE id = ?";
    const results = await db.query(sql, [id]);
    if (results.length === 0) return null;

    const user = results[0];
    user.availability = user.availability ? JSON.parse(user.availability) : [];
    return new User(user);
  }

  // -----------------------------------
  // --- Profile Methods ---
  // -----------------------------------

  /**
   * Update profile fields: profilePicture, skills, availability
   */
  async updateProfile() {
    const sql = `UPDATE users SET profilePicture = ?, skills = ?, availability = ? WHERE id = ?`;
    const availabilityStr = JSON.stringify(this.availability);

    return await db.query(sql, [
      this.profilePicture,
      this.skills,
      availabilityStr,
      this.id,
    ]);
  }
}

module.exports = User;