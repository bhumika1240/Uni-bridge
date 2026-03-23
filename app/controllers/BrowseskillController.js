const User = require("../models/User");

const BrowseskillController = {
  // Show search page (Initial load)
  viewSearch: async (req, res) => {
    try {
      const email = req.session.user?.email;
      const currentUser = await User.findByEmail(email);

      res.render("browseskills", { 
        user: currentUser, 
        users: [], 
        query: "", 
        error: null 
      });
    } catch (err) {
      res.render("browseskills", { user: null, users: [], query: "", error: "Error loading page" });
    }
  },

  // Process skill search (POST request)
  searchBySkill: async (req, res) => {
    try {
      const email = req.session.user?.email;
      const currentUser = await User.findByEmail(email);
      const { skill } = req.body;

      if (!skill || skill.trim() === "") {
        return res.render("browseskills", { 
          user: currentUser, 
          users: [], 
          query: "", 
          error: "Please enter a skill to search" 
        });
      }

      // Search for other users with this skill
      const foundUsers = await User.findBySkill(skill.trim());

      // Filter out the current user so they don't find themselves
      const filteredUsers = foundUsers.filter(u => u.id !== currentUser.id);

      res.render("browseskills", {
        user: currentUser,
        users: filteredUsers,
        query: skill,
        error: filteredUsers.length === 0 ? `No users found for "${skill}"` : null
      });

    } catch (err) {
      console.error(err);
      res.render("browseskills", { user: null, users: [], query: "", error: "Search failed" });
    }
  }
};

module.exports = BrowseskillController;