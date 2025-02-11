const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/userModel'); // Import the User model (updated one)
const router = express.Router();

router.get('/:userId/meals', async (req, res) => {
  const { userId } = req.params; // Get userId from the URL parameter

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Respond with the user's mealLog
    res.status(200).json({ mealLog: user.mealLog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving meals' });
  }
});

module.exports = router;