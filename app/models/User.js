/**
 * User.js Model
 * Handles all database interactions for the User entity, 
 * including Skills and Availability relationships.
 */

const db = require("../services/db");

class User {
  /**
   * Constructor: Maps database rows to a JavaScript Object.
   * Uses safety defaults to prevent "undefined" errors in the Pug views.
   */
  constructor(data = {}) {
    this.id = data.id || null;
    this.firstname = data.firstname || "";
    this.lastname = data.lastname || "";
    this.dob = data.dob || null;
    this.gender = data.gender || null;
    this.email = data.email || "";
    this.password = data.password || "";
    this.role = data.role || "user";
    this.profilePicture = data.profile_picture || "/images/default-avatar.png";
    
    // all_skills is a virtual field populated during search via GROUP_CONCAT
    this.all_skills = data.all_skills || ""; 
    
    // Arrays for detailed profile views
    this.skills = data.skills || [];
    this.availability = data.availability || [];
  }

  /**
   * CROSS-TABLE SEARCH: Finds users based on the 'skills' table.
   * Uses INNER JOIN to connect users (u) and skills (s).
   */
  static async findBySkill(skillName) {
    try {
      const sql = `
        SELECT u.id, u.firstname, u.lastname, u.profile_picture, 
               GROUP_CONCAT(s.skill SEPARATOR ', ') as all_skills
        FROM users u
        INNER JOIN skills s ON u.id = s.user_id
        WHERE u.id IN (
            SELECT user_id FROM skills WHERE skill LIKE ?
        )
        GROUP BY u.id
      `;
      // Use %wildcards% so "Java" matches "JavaScript" or "Advanced Java"
      const results = await db.query(sql, [`%${skillName.trim()}%`]);
      return results; 
    } catch (err) {
      console.error("DB Error in findBySkill:", err);
      return [];
    }
  }

  /**
   * Fetches a user by email and populates their full profile.
   */
  static async findByEmail(email) {
    try {
      if (!email) return null;
      const rows = await db.query("SELECT * FROM users WHERE email = ?", [email.trim()]);
      
      if (rows && rows.length > 0) {
        const user = new User(rows[0]);

        // Populate skills from skills table
        const skillsRows = await db.query("SELECT skill FROM skills WHERE user_id = ?", [user.id]);
        user.skills = skillsRows.map(r => r.skill);

        // Populate availability from availability table
        const availRows = await db.query(
          "SELECT day, from_time as `from`, to_time as `to` FROM availability WHERE user_id = ?",
          [user.id]
        );
        user.availability = availRows;

        return user;
      }
      return null;
    } catch (err) {
      console.error("DB Error in findByEmail:", err);
      return null;
    }
  }

  /**
   * Fetches a single user by ID for profile viewing.
   */
  static async findById(id) {
    try {
      if (!id) return null;
      const rows = await db.query("SELECT * FROM users WHERE id = ?", [id]);
      
      if (rows && rows.length > 0) {
        const user = new User(rows[0]);

        const skillsRows = await db.query("SELECT skill FROM skills WHERE user_id = ?", [id]);
        user.skills = skillsRows.map(r => r.skill);

        const availRows = await db.query(
          "SELECT day, from_time as `from`, to_time as `to` FROM availability WHERE user_id = ?",
          [id]
        );
        user.availability = availRows;

        return user;
      }
      return null;
    } catch (err) {
      console.error("DB Error in findById:", err);
      return null;
    }
  }

  /**
   * Registration: Saves basic user info.
   */
  async save() {
    try {
      const result = await db.query(
        "INSERT INTO users (firstname, lastname, dob, gender, email, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [this.firstname, this.lastname, this.dob, this.gender, this.email, this.password, this.role]
      );
      this.id = result.insertId;
      return this;
    } catch (err) {
      console.error("DB Error in save():", err);
      throw err;
    }
  }

  /**
   * Syncs Skills and Availability (Delete-then-Insert pattern).
   */
  async updateProfile({ skills = [], availability = [] } = {}) {
    try {
      // 1. Clear and Re-insert Skills
      await db.query("DELETE FROM skills WHERE user_id = ?", [this.id]);
      if (skills.length > 0) {
        const skillValues = skills.map(s => [this.id, s]);
        await db.query("INSERT INTO skills (user_id, skill) VALUES ?", [skillValues]);
      }

      // 2. Clear and Re-insert Availability
      await db.query("DELETE FROM availability WHERE user_id = ?", [this.id]);
      if (availability.length > 0) {
        const availValues = availability.map(a => [this.id, a.day, a.from, a.to]);
        await db.query("INSERT INTO availability (user_id, day, from_time, to_time) VALUES ?", [availValues]);
      }
      return true;
    } catch (err) {
      console.error("DB Error in updateProfile:", err);
      throw err;
    }
  }

  /**
   * Updates profile image path.
   */
  async updateProfilePicture(path) {
    try {
      await db.query("UPDATE users SET profile_picture = ? WHERE id = ?", [path, this.id]);
      this.profilePicture = path;
      return true;
    } catch (err) {
      console.error("DB Error in updateProfilePicture:", err);
      throw err;
    }
  }
}

module.exports = User;