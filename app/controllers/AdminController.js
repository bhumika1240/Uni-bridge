/**
 * AdminController.js
 * handles administrative actions: Viewing all users, updating their 
 * multi-table data (skills/availability), and performing cascading deletes.
 */
const User = require("../models/User");
const db = require("../services/db");

class AdminController {
  
  /**
   * GET /admin/users
   * Displays all registered users with their joined skills, plus review and status.
   */
  static async manageUsers(req, res) {
    try {
      // Joins skills and pulls review/status from the users table
      const sql = `
        SELECT u.id, u.firstname, u.lastname, u.email, u.role, u.created_at, u.review, u.status,
               GROUP_CONCAT(s.skill SEPARATOR ', ') as skills
        FROM users u
        LEFT JOIN skills s ON u.id = s.user_id
        WHERE u.role = 'user'
        GROUP BY u.id
        ORDER BY u.created_at DESC
      `;
      
      const allUsers = await db.query(sql);

      res.render("manageUsers", {
        user: req.session.user, 
        allUsers: allUsers || [],
        query: req.query, 
        title: "Admin - User Management"
      });
    } catch (err) {
      console.error("Admin View Error:", err);
      res.status(500).send("Error: Could not retrieve the user list.");
    }
  }

  /**
   * POST /admin/update/:id
   * Updates user profile, skills, and admin-specific review/status.
   */
  static async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const { skills, availability, review, status } = req.body;

      // 1. Find the existing User object
      const user = await User.findById(userId);
      if (!user) return res.status(404).send("User not found");

      // 2. Update the 'users' table directly for Review and Status
      await db.query("UPDATE users SET review = ?, status = ? WHERE id = ?", [review, status, userId]);

      // 3. Process skills string into an array for the Model logic
      const skillsArray = skills 
        ? skills.split(',').map(s => s.trim()).filter(s => s !== "") 
        : [];

      // 4. Update Skills and Availability via the Model
      await user.updateProfile({ 
        skills: skillsArray,
        availability: availability || user.availability
      });

      res.redirect("/admin/users?msg=UserUpdated");
    } catch (err) {
      console.error("Admin Update Error:", err);
      res.status(500).send("Error: Failed to update user data.");
    }
  }

  /**
   * POST /admin/delete/:id
   * Cascading Delete: Removes user from EVERY table.
   */
  static async deleteUser(req, res) {
    try {
      const userId = req.params.id;

      if (parseInt(userId) === parseInt(req.session.user.id)) {
        return res.redirect("/admin/users?msg=ErrorSelfDelete");
      }

      // Step-by-Step Cleanup
      await db.query("DELETE FROM messages WHERE sender_id = ? OR receiver_id = ?", [userId, userId]);
      await db.query("DELETE FROM swaps WHERE requester_id = ? OR provider_id = ?", [userId, userId]);
      await db.query("DELETE FROM skills WHERE user_id = ?", [userId]);
      await db.query("DELETE FROM availability WHERE user_id = ?", [userId]);
      await db.query("DELETE FROM users WHERE id = ?", [userId]);

      res.redirect("/admin/users?msg=UserDeleted");
    } catch (err) {
      console.error("Admin Delete Error:", err);
      res.status(500).send("Error: Critical failure during user deletion.");
    }
  }
}

module.exports = AdminController;