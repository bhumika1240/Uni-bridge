const User = require("../models/User");

class BrowseskillController {
  /**
   * GET /browseskills
   * Renders the initial landing page without a search performed.
   */
  viewSearch = async (req, res) => {
    try {
      res.render("browseskills", { 
        users: [], 
        query: "", 
        error: null,
        user: req.session.user 
      });
    } catch (err) {
      console.error("View Search Error:", err);
      res.status(500).send("Error loading search page");
    }
  }

  /**
   * POST /browseskills/search
   * Handles the actual database query and filtering.
   */
  searchBySkill = async (req, res) => {
    try {
      // 1. Capture the search term
      const skill = (req.body.skill || req.query.skill || "").trim();
      const currentUserId = req.session.user ? req.session.user.id : null;

      // 2. If no skill entered, just show the blank state
      if (!skill) {
        return this.viewSearch(req, res);
      }

      // 3. Fetch users from the Model
      const allFound = await User.findBySkill(skill);
      
      // 4. Filter: Don't show the logged-in user in their own search results
      const results = allFound.filter(u => u.id !== currentUserId);

      // 5. Render the page with results
      res.render("browseskills", {
        users: results,
        query: skill,
        error: results.length === 0 ? `No students found for "${skill}"` : null,
        user: req.session.user
      });

    } catch (err) {
      console.error("Search Error:", err);
      res.render("browseskills", { 
        users: [], 
        query: "", 
        error: "Search failed. Please try again.",
        user: req.session.user 
      });
    }
  }
}

// Export as an INSTANCE so routes can call methods directly
module.exports = new BrowseskillController();