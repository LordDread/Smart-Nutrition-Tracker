const express = require('express');
const axios = require('axios'); // Import axios to make API requests
const User = require('../../models/userModel'); // Import the User model
const router = express.Router();

// Route to add a meal to a user
router.post('/:userId/meal', async (req, res) => {
  const { userId } = req.params; // Get userId from the URL parameter
  const { mealName, date, time, description } = req.body; // Extract required fields from the request body

  // Validate required fields
  if (!mealName || !date || !time || !description) {
    return res.status(400).json({ error: 'Meal name, date, time, and description are required.' });
  }

  try {
    // Step 1: Send the description to the external API for processing
    const apiResponse = await axios.post('http://localhost:8081/api/query', { prompt: description });

    // Step 2: Extract the processed data from the API response
    const processedData = apiResponse.data; // Assuming the API returns a JSON object

    // Step 3: Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Step 4: Normalize date to UTC (only the day)
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    // Step 5: Create the new meal with the processed data
    const newMeal = {
      mealName,
      time,
      description,
      calories: processedData.calories || 0,
      carbs: processedData.carbs || 0,
      protein: processedData.protein || 0,
      fat: processedData.fat || 0,
      fiber: processedData.fiber || 0,
      sugar: processedData.sugar || 0,
      sodium: processedData.sodium || 0,
      cholesterol: processedData.cholesterol || 0,
      vitaminA: processedData.vitaminA || 0,
      vitaminB2: processedData.vitaminB2 || 0,
      vitaminB6: processedData.vitaminB6 || 0,
      vitaminB12: processedData.vitaminB12 || 0,
      vitaminC: processedData.vitaminC || 0,
      vitaminD: processedData.vitaminD || 0,
      vitaminE: processedData.vitaminE || 0,
      vitaminK: processedData.vitaminK || 0,
      calcium: processedData.calcium || 0,
      iron: processedData.iron || 0,
      magnesium: processedData.magnesium || 0,
      potassium: processedData.potassium || 0,
      zinc: processedData.zinc || 0,
    };

    // Step 6: Find the day entry for the normalized date
    let dayEntry = user.mealLog.find(entry => entry.date.getTime() === normalizedDate.getTime());

    if (!dayEntry) {
      // If no day entry exists, create a new one
      dayEntry = {
        date: normalizedDate,
        meals: [newMeal],
      };
      user.mealLog.push(dayEntry);
    } else {
      // Add the new meal to the day's meals
      dayEntry.meals.push(newMeal);
    }

    // Step 7: Save the user with the new meal added to the mealLog
    await user.save();

    // Step 8: Respond with the updated user data
    res.status(201).json({ message: 'Meal added to user', meal: newMeal });
  } catch (error) {
    console.error('Error adding meal:', error);
    res.status(500).json({ error: 'An error occurred while adding the meal.' });
  }
});

module.exports = router;