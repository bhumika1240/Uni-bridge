/**
 * SwapController.js
 * Handles the creation of swap requests and the status updates (Accept/Reject).
 */
const Swap = require("../models/Swap");

class SwapController {
  
  /**
   * POST /swaps/create
   * Triggered when a user submits the form on another student's profile.
   */
  static async createSwap(req, res) {
    try {
      const { providerId, skillRequested, skillOffered } = req.body;
      const requesterId = req.session.user.id;

      // 1. Validation: Ensure you aren't swapping with yourself
      if (requesterId == providerId) {
        return res.status(400).send("You cannot request a swap with yourself.");
      }

      // 2. Validation: Ensure both skills were selected
      if (!skillRequested || !skillOffered) {
        return res.status(400).send("Please select both skills for the exchange.");
      }

      // 3. Create the record in the database (defaults to 'pending')
      await Swap.create({
        requesterId,
        providerId,
        skillOffered,
        skillRequested
      });

      // 4. Success! Redirect to My Swaps to see the new entry
      res.redirect("/myswaps");
    } catch (err) {
      console.error("Error creating swap:", err);
      res.status(500).send("Internal Server Error: Could not process swap request.");
    }
  }

  /**
   * POST /swaps/action
   * Triggered when a user clicks "Accept" or "Decline" in their My Swaps list.
   */
  static async handleAction(req, res) {
    try {
      const { swapId, action } = req.body; // action will be 'accepted' or 'rejected'
      const userId = req.session.user.id;

      // 1. Fetch the swap to verify the current user is the intended recipient
      const swap = await Swap.findById(swapId);

      if (!swap) {
        return res.status(404).send("Swap request not found.");
      }

      // 2. Security: Only the provider (recipient) can accept or reject
      if (swap.provider_id !== userId) {
        return res.status(403).send("You are not authorized to perform this action.");
      }

      // 3. Update the status in the database
      await Swap.updateStatus(swapId, action);

      // 4. Redirect back to My Swaps to see the updated status
      res.redirect("/myswaps");
    } catch (err) {
      console.error("Error updating swap status:", err);
      res.status(500).send("Internal Server Error: Action failed.");
    }
  }
}

module.exports = SwapController;