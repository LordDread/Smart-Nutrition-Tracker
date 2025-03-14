const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/userModel'); // Import the User model (updated one)
const router = express.Router();

router.get('/:userId/meals', async (req, res) => {
  const { userId } = req.params; // Get userId from the URL parameter
  const { startDate, endDate } = req.query; // Get optional date range from query parameters

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Filter meal logs by date range if provided
    let mealLogs = user.mealLog;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      mealLogs = mealLogs.filter(meal => {
        const mealDate = new Date(meal.date);
        return mealDate >= start && mealDate <= end;
      });
    }

    // Respond with the filtered or all meal logs
    res.status(200).json({ mealLog: mealLogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving meals' });
  }
});

module.exports = router;