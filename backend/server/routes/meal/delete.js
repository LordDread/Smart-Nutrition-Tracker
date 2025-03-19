const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/userModel'); // Import the User model
const router = express.Router();

router.delete('/:userId/meal/:mealId', async (req, res) => {
  const { userId, mealId } = req.params; // Get userId and mealId from URL parameters

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the day entry that contains the meal
    const dayEntry = user.mealLog.find(day => 
      day.meals.some(meal => meal._id.toString() === mealId)
    );

    if (!dayEntry) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    // Find the index of the meal in the day's meals array
    const mealIndex = dayEntry.meals.findIndex(meal => meal._id.toString() === mealId);

    if (mealIndex === -1) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    // Remove the meal from the day's meals array
    dayEntry.meals.splice(mealIndex, 1);

    // If the day's meals array is now empty, remove the day entry from the mealLog
    if (dayEntry.meals.length === 0) {
      user.mealLog = user.mealLog.filter(day => day._id.toString() !== dayEntry._id.toString());
    }

    // Save the updated user document
    await user.save();

    // Respond with a success message
    res.status(200).json({ message: 'Meal deleted', user });
  } catch (error) {
    console.error('Error deleting meal:', error);
    res.status(500).json({ error: 'An error occurred while deleting the meal' });
  }
});

module.exports = router;