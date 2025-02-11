const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/userModel'); // Import the User model (updated one)
const router = express.Router();

router.get('/:userId/meal/:mealId', async (req, res) => {
    const { userId, mealId } = req.params; // Get userId and mealId from URL parameters
  
    try {
      // Find the user by userId
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Find the meal in the user's mealLog by mealId
      const meal = user.mealLog.find((meal) => meal._id.toString() === mealId);
  
      if (!meal) {
        return res.status(404).json({ error: 'Meal not found' });
      }
  
      // Respond with the found meal
      res.status(200).json({ meal });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving the meal' });
    }
  });

module.exports = router;