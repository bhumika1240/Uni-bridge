/**
 * MessageController.js
 * Handles viewing chat history and sending new messages.
 */
const Message = require("../models/Message");
const User = require("../models/User");
const db = require("../services/db");

class MessageController {
  /**
   * GET /chat/:id
   * Fetches the conversation between the logged-in user and the selected student.
   */
  static async viewChat(req, res) {
    try {
      const myId = req.session.user.id;
      const otherId = req.params.id;

      // 1. Get the profile of the person we are talking to
      const otherUser = await User.findById(otherId);
      if (!otherUser) {
        return res.redirect("/messages");
      }

      // 2. Mark messages as read (where I am the receiver)
      await db.query(
        "UPDATE messages SET is_read = 1 WHERE receiver_id = ? AND sender_id = ?",
        [myId, otherId]
      );

      // 3. Fetch history using the Model
      // IMPORTANT: Ensure Message.getChatHistory uses the (A to B) OR (B to A) logic
      const history = await Message.getChatHistory(myId, otherId);

      // 4. Render the chat view
      res.render("chat", {
        user: req.session.user,
        otherUser,
        chatHistory: history || [], // This variable name must match your Pug loop
        title: `Chat with ${otherUser.firstname}`
      });
    } catch (err) {
      console.error("Chat View Error:", err);
      res.redirect("/messages");
    }
  }

  /**
   * POST /chat/send
   * Processes the message form submission.
   */
  static async sendMessage(req, res) {
    try {
      // These names must match the 'name' attribute in your Pug form inputs
      const { receiver_id, content } = req.body; 
      const senderId = req.session.user.id;

      // Validation: Prevent empty messages
      if (!content || !content.trim()) {
        // Fix for deprecated res.location("back")
        return res.redirect(req.get("Referrer") || `/chat/${receiver_id}`);
      }

      // 5. Create the message in the database
      // Ensure your Message.create method uses (sender, receiver, content)
      await Message.create(senderId, receiver_id, content);
      
      // 6. Redirect back to the same chat room to see the new message
      res.redirect(`/chat/${receiver_id}`); 
    } catch (err) {
      console.error("Send Message Error:", err);
      res.status(500).send("Message failed to send. Please try again.");
    }
  }
}

module.exports = MessageController;