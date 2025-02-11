const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/userModel'); // Import the User model (updated one)
const router = express.Router();

router.delete('/:userId/meal/:mealId', async (req, res) => {
    const { userId, mealId } = req.params; // Get userId and mealId from URL parameters
  
    try {
      // Find the user by userId
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Find the index of the meal in the user's mealLog array by mealId
      const mealIndex = user.mealLog.findIndex((meal) => meal._id.toString() === mealId);
  
      if (mealIndex === -1) {
        return res.status(404).json({ error: 'Meal not found' });
      }
  
      // Remove the meal from the mealLog array
      user.mealLog.splice(mealIndex, 1);
  
      // Save the updated user document
      await user.save();
  
      // Respond with a success message
      res.status(200).json({ message: 'Meal deleted', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while deleting the meal' });
    }
  });

  module.exports = router;