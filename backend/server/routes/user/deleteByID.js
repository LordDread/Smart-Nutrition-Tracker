const express = require("express");
const router = express.Router();
const userModel = require("../../models/userModel");

// Delete user by ID using query parameter
router.delete("/delete", async (req, res) => {
  const { userId } = req.query; // Get userId from query parameter

  // Check if userId is provided
  if (!userId) {
    return res.status(400).send({ message: "userId is required" });
  }

  try {
    // Try to find and delete the user by ID
    const user = await userModel.findByIdAndDelete(userId);

    // If user is not found
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Send success message
    return res.status(200).send({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;