const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userModel = require("../../models/userModel");

// Verify user password
router.post("/verifyPassword", async (req, res) => {
  const { userId, password } = req.body;

  // Check if userId and password are provided
  if (!userId || !password) {
    return res.status(400).json({ message: "User ID and password are required" });
  }

  try {
    // Find the user by ID
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided password matches the user's password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Password verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;