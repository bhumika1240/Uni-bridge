const User = require("../models/User");
const Swap = require("../models/Swap");
const Message = require("../models/Message");
const db = require("../services/db");

class DashboardController {
  async getFullUser(req) {
    try {
      const userId = req.session.user?.id;
      if (!userId) return null;
      const user = await User.findById(userId);
      if (user) {
        const msgRes = await db.query("SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = 0", [user.id]);
        user.unreadMessages = msgRes[0]?.count || 0;
        const swapRes = await db.query("SELECT COUNT(*) as count FROM swaps WHERE provider_id = ? AND status = 'pending'", [user.id]);
        user.pendingSwaps = swapRes[0]?.count || 0;
      }
      return user;
    } catch (err) {
      console.error("getFullUser Error:", err);
      return null;
    }
  }

  dashboard = async (req, res) => {
    try {
      const user = await this.getFullUser(req);
      if (!user) return res.redirect("/login");
      if (user.role === 'admin') return res.redirect("/admin/users");
      res.render("dashboard", { user, title: "My Dashboard" });
    } catch (err) {
      console.error("Dashboard Error:", err);
      res.status(500).send("Internal Server Error");
    }
  }

  viewUserProfile = async (req, res) => {
    try {
      const targetId = req.params.id;
      const currentUser = await this.getFullUser(req);
      const targetUser = await User.findById(targetId);
      if (!targetUser) return res.status(404).send("User not found");
      res.render("studentProfile", { targetUser, user: currentUser, title: "Student Profile" });
    } catch (err) {
      res.redirect("/browseskills");
    }
  }

  myswaps = async (req, res) => {
    try {
      const user = await this.getFullUser(req);
      const swaps = await Swap.getByUserId(user.id);
      res.render("myswaps", { user, swaps, title: "My Swaps" });
    } catch (err) { res.status(500).send("Error"); }
  }

  messages = async (req, res) => {
    try {
      const user = await this.getFullUser(req);
      const inbox = await Message.getInbox(user.id);
      res.render("messages", { user, inbox: inbox || [], title: "My Messages" });
    } catch (err) { res.redirect("/dashboard"); }
  }

  settings = async (req, res) => {
    try {
      const user = await this.getFullUser(req);
      res.render("settings", { user, title: "Settings" });
    } catch (err) { res.redirect("/dashboard"); }
  }
}

module.exports = new DashboardController();