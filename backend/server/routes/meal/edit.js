const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/userModel'); // Import the User model
const router = express.Router();

router.put('/:userId/meal/:mealId', async (req, res) => {
  const { userId, mealId } = req.params; // Get userId and mealId from URL parameters
  const {
    mealName, date, time, calories, carbs = 0, protein = 0, fat = 0, fiber = 0, sugar = 0,
    sodium = 0, cholesterol = 0, vitaminA = 0, vitaminB2 = 0, vitaminB6 = 0, vitaminB12 = 0,
    vitaminC = 0, vitaminD = 0, vitaminE = 0, vitaminK = 0, calcium = 0, iron = 0,
    magnesium = 0, potassium = 0, zinc = 0, description = ''
  } = req.body;

  // Validate input data
  if (!mealName || !date || !time || !calories) {
    return res.status(400).json({ error: 'Meal name, date, time, and calories are required' });
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

    // Find the day entry for the normalized date
    let dayEntry = user.mealLog.find(entry => entry.date.getTime() === normalizedDate.getTime());

    if (!dayEntry) {
      return res.status(404).json({ error: 'Day entry not found' });
    }

    // Find the meal in the day's meals by mealId
    const mealIndex = dayEntry.meals.findIndex((meal) => meal._id.toString() === mealId);

    if (mealIndex === -1) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    // Update the meal details
    dayEntry.meals[mealIndex] = {
      ...dayEntry.meals[mealIndex],
      mealName,
      time,
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

    // Save the updated user document
    await user.save();

    // Respond with the updated user data
    res.status(200).json({ message: 'Meal updated', user });
  } catch (error) {
    console.error('Error updating meal:', error);
    res.status(500).json({ error: 'An error occurred while updating the meal' });
  }
});

module.exports = router;