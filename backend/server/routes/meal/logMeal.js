const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/userModel'); // Import the User model (updated one)
const router = express.Router();

// Route to add a meal to a user
router.post('/user/:userId/meal', async (req, res) => {
  const { userId } = req.params; // Get userId from the URL parameter
  const { mealName, date, calories, description } = req.body;

  // Validate input data
  if (!mealName || !date || !calories) {
    return res.status(400).json({ error: 'Meal name, date, and calories are required' });
  }

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create the new meal
    const newMeal = {
      mealName,
      date,
      calories,
      description: description || '', // Default to empty string if not provided
    };

    // Add the new meal to the user's mealLog array
    user.mealLog.push(newMeal);

    // Save the user with the new meal added to the mealLog
    await user.save();

    // Respond with the updated user data
    res.status(201).json({ message: 'Meal added to user', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while adding the meal' });
  }
});

module.exports = router;