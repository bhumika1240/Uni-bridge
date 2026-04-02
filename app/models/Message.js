const db = require("../services/db");

class Message {
  /**
   * Save a new message
   */
  static async create(senderId, receiverId, text) {
    try {
      // ✅ UPDATED: Changed message_text to content
      const sql = "INSERT INTO messages (sender_id, receiver_id, content, is_read) VALUES (?, ?, ?, 0)";
      return await db.query(sql, [senderId, receiverId, text]);
    } catch (err) {
      console.error("SQL Error in Message.create:", err);
      throw err;
    }
  }

  /**
   * Get full conversation (Both sides)
   */
  static async getChatHistory(user1, user2) {
    try {
      // ✅ UPDATED: m.* will now include the 'content' column
      const sql = `
        SELECT m.*, u.firstname AS sender_name 
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE (m.sender_id = ? AND m.receiver_id = ?) 
           OR (m.sender_id = ? AND m.receiver_id = ?)
        ORDER BY m.created_at ASC
      `;
      
      return await db.query(sql, [user1, user2, user2, user1]);
    } catch (err) {
      console.error("SQL Error in getChatHistory:", err);
      return [];
    }
  }

  /**
   * Get unique conversations for the inbox
   */
  static async getInbox(userId) {
    try {
      // ✅ UPDATED: Changed m.message_text to m.content
      const sql = `
        SELECT 
          u.id AS contact_id, 
          u.firstname, 
          u.lastname, 
          u.profile_picture,
          m.content AS last_message,
          m.created_at AS last_message_time
        FROM messages m
        JOIN users u ON (CASE WHEN m.sender_id = ? THEN m.receiver_id = u.id ELSE m.sender_id = u.id END)
        WHERE (m.sender_id = ? OR m.receiver_id = ?)
        AND m.id IN (
          SELECT MAX(id) 
          FROM messages 
          WHERE sender_id = ? OR receiver_id = ? 
          GROUP BY LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id)
        )
        ORDER BY m.created_at DESC
      `;
      return await db.query(sql, [userId, userId, userId, userId, userId]);
    } catch (err) {
      console.error("SQL Error in getInbox:", err);
      return [];
    }
  }
}

module.exports = Message;