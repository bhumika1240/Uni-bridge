/**
 * Swap.js Model
 * Manages the 'swaps' table which acts as the contract 
 * between two users exchanging skills.
 */

const db = require("../services/db");

class Swap {
  /**
   * Create a new pending swap request.
   * @param {Object} data - Contains requesterId, providerId, skillOffered, skillRequested
   */
  static async create(data) {
    try {
      const { requesterId, providerId, skillOffered, skillRequested } = data;
      const sql = `
        INSERT INTO swaps (requester_id, provider_id, skill_offered, skill_requested, status) 
        VALUES (?, ?, ?, ?, 'pending')
      `;
      const result = await db.query(sql, [requesterId, providerId, skillOffered, skillRequested]);
      return result;
    } catch (err) {
      console.error("DB Error in Swap.create:", err);
      throw err;
    }
  }

  /**
   * Fetches all swaps associated with a user.
   * Uses JOINs to get the names of the people involved.
   */
  static async getByUserId(userId) {
    try {
      const sql = `
        SELECT 
          s.*, 
          u1.firstname AS requester_name, 
          u1.profile_picture AS requester_pic,
          u2.firstname AS provider_name,
          u2.profile_picture AS provider_pic
        FROM swaps s
        JOIN users u1 ON s.requester_id = u1.id
        JOIN users u2 ON s.provider_id = u2.id
        WHERE s.requester_id = ? OR s.provider_id = ?
        ORDER BY s.created_at DESC
      `;
      return await db.query(sql, [userId, userId]);
    } catch (err) {
      console.error("DB Error in Swap.getByUserId:", err);
      return [];
    }
  }

  /**
   * Updates the status of a swap (e.g., 'accepted', 'rejected', 'completed').
   */
  static async updateStatus(swapId, status) {
    try {
      const sql = "UPDATE swaps SET status = ? WHERE id = ?";
      return await db.query(sql, [status, swapId]);
    } catch (err) {
      console.error("DB Error in Swap.updateStatus:", err);
      throw err;
    }
  }

  /**
   * Finds a single swap by ID.
   * Useful for verifying a swap before allowing an update.
   */
  static async findById(swapId) {
    try {
      const sql = "SELECT * FROM swaps WHERE id = ?";
      const rows = await db.query(sql, [swapId]);
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      console.error("DB Error in Swap.findById:", err);
      return null;
    }
  }
}

module.exports = Swap;