const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/userModel'); // Import the User model
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

      // Validate the dates
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ error: 'Invalid date range provided' });
      }

      mealLogs = mealLogs.filter(day => {
        const dayDate = new Date(day.date);
        return dayDate >= start && dayDate <= end;
      });
    }

    // Sort the meal logs by date in ascending order
    mealLogs.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Respond with the filtered or all meal logs
    res.status(200).json({ mealLog: mealLogs });
  } catch (error) {
    console.error('Error retrieving meals:', error);
    res.status(500).json({ error: 'An error occurred while retrieving meals' });
  }
});

module.exports = router;