const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/userModel'); // Import the User model (updated one)
const router = express.Router();

// Route to add a meal to a user
router.post('/:userId/meal', async (req, res) => {
  const { userId } = req.params; // Get userId from the URL parameter
  const {
    mealName, date, calories, carbs = 0, protein = 0, fat = 0, fiber = 0, sugar = 0,
    sodium = 0, cholesterol = 0, vitaminA = 0, vitaminB2 = 0, vitaminB6 = 0, vitaminB12 = 0,
    vitaminC = 0, vitaminD = 0, vitaminE = 0, vitaminK = 0, calcium = 0, iron = 0,
    magnesium = 0, potassium = 0, zinc = 0, description = ''
  } = req.body;

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

    // Normalize date to UTC
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    // Create the new meal
    const newMeal = {
      mealName,
      date: normalizedDate,
      calories,
      carbs,
      protein,
      fat,
      fiber,
      sugar,
      sodium,
      cholesterol,
      vitaminA,
      vitaminB2,
      vitaminB6,
      vitaminB12,
      vitaminC,
      vitaminD,
      vitaminE,
      vitaminK,
      calcium,
      iron,
      magnesium,
      potassium,
      zinc,
      description
    };

    // Add the new meal to the user's mealLog array
    user.mealLog.push(newMeal);

    // Save the user with the new meal added to the mealLog
    await user.save();

    // Respond with the updated user data
    res.status(201).json({ message: 'Meal added to user', user });
  } catch (error) {
    console.error('Error adding meal:', error);
    res.status(500).json({ error: 'An error occurred while adding the meal' });
  }
});

module.exports = router;