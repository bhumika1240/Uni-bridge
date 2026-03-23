const db = require("../services/db");

class User {
  /**
   * Constructor with safety defaults to prevent "undefined" errors
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
    this.skills = data.skills || [];
    this.availability = data.availability || [];
  }

  /**
   * Find user by email (Used for Login and Session fetching)
   */
  static async findByEmail(email) {
    try {
      if (!email) return null;
      const rows = await db.query("SELECT * FROM users WHERE email = ?", [email.trim()]);
      
      if (rows && rows.length > 0) {
        const user = new User(rows[0]);

        // Fetch associated skills
        const skillsRows = await db.query("SELECT skill FROM skills WHERE user_id = ?", [user.id]);
        user.skills = skillsRows.map(r => r.skill);

        // Fetch associated availability
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
   * Find user by ID (Used for viewing other students' profiles)
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
   * Search for users by a specific skill (Used by BrowseskillController)
   */
  static async findBySkill(skill) {
    try {
      // Joins users and skills, grouping all skills into a single string for display
      const sql = `
        SELECT u.id, u.firstname, u.lastname, u.profile_picture, 
               (SELECT GROUP_CONCAT(skill SEPARATOR ', ') FROM skills WHERE user_id = u.id) as all_skills
        FROM users u
        JOIN skills s ON u.id = s.user_id
        WHERE s.skill LIKE ?
        GROUP BY u.id
      `;
      const rows = await db.query(sql, [`%${skill}%`]);
      return rows; 
    } catch (err) {
      console.error("DB Error in findBySkill:", err);
      return [];
    }
  }

  /**
   * Create a new user (Used by AuthController Signup)
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
   * Update Profile Skills and Availability (Used by ProfileController)
   */
  async updateProfile({ skills = [], availability = [] } = {}) {
    try {
      // Handle Skills: Delete old and insert new
      await db.query("DELETE FROM skills WHERE user_id = ?", [this.id]);
      if (skills.length > 0) {
        const skillValues = skills.map(s => [this.id, s]);
        await db.query("INSERT INTO skills (user_id, skill) VALUES ?", [skillValues]);
      }

      // Handle Availability: Delete old and insert new
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
   * Update the profile picture path
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