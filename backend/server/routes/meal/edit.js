const express = require('express');
const axios = require('axios'); // Import axios to make API requests
const User = require('../../models/userModel'); // Import the User model
const router = express.Router();

router.put('/:userId/meal/:mealId', async (req, res) => {
  const { userId, mealId } = req.params; // Get userId and mealId from URL parameters
  const { mealName, date, time, description } = req.body; // Extract required fields from the request body

  // Validate required fields
  if (!mealName || !date || !time || !description) {
    return res.status(400).json({ error: 'Meal name, date, time, and description are required.' });
  }

  try {
    // Step 1: Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Step 2: Normalize the date to UTC
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    // Step 3: Find the original day entry containing the meal
    const originalDayEntry = user.mealLog.find((entry) =>
      entry.meals.some((meal) => meal._id.toString() === mealId)
    );

    if (!originalDayEntry) {
      return res.status(404).json({ error: 'Meal not found in any day entry.' });
    }

    // Step 4: Find the meal in the original day's meals array
    const mealIndex = originalDayEntry.meals.findIndex((meal) => meal._id.toString() === mealId);

    if (mealIndex === -1) {
      return res.status(404).json({ error: 'Meal not found.' });
    }

    const existingMeal = originalDayEntry.meals[mealIndex];

    // Step 5: Check if the description has changed
    let processedData;
    if (existingMeal.description === description) {
      // If the description is the same, reuse the current nutritional information
      processedData = {
        calories: existingMeal.calories,
        carbs: existingMeal.carbs,
        protein: existingMeal.protein,
        fat: existingMeal.fat,
        fiber: existingMeal.fiber,
        sugar: existingMeal.sugar,
        sodium: existingMeal.sodium,
        cholesterol: existingMeal.cholesterol,
        vitaminA: existingMeal.vitaminA,
        vitaminB2: existingMeal.vitaminB2,
        vitaminB6: existingMeal.vitaminB6,
        vitaminB12: existingMeal.vitaminB12,
        vitaminC: existingMeal.vitaminC,
        vitaminD: existingMeal.vitaminD,
        vitaminE: existingMeal.vitaminE,
        vitaminK: existingMeal.vitaminK,
        calcium: existingMeal.calcium,
        iron: existingMeal.iron,
        magnesium: existingMeal.magnesium,
        potassium: existingMeal.potassium,
        zinc: existingMeal.zinc,
      };
    } else {
      // If the description has changed, query the external API
      const apiResponse = await axios.post('http://localhost:8081/api/query', { prompt: description });
      processedData = apiResponse.data; // Assuming the API returns a JSON object
    }

    // Step 6: Create the updated meal object
    const updatedMeal = {
      ...existingMeal._doc, // Retain existing fields
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

    // Step 7: Check if the date has changed
    const originalDate = new Date(originalDayEntry.date);
    originalDate.setUTCHours(0, 0, 0, 0);

    if (originalDate.getTime() === normalizedDate.getTime()) {
      // If the date has not changed, simply update the meal
      originalDayEntry.meals[mealIndex] = updatedMeal;
    } else {
      // If the date has changed, move the meal to the new date
      // Remove the meal from the original day's meals array
      originalDayEntry.meals.splice(mealIndex, 1);

      // Find or create the new day entry
      let newDayEntry = user.mealLog.find(
        (entry) => new Date(entry.date).getTime() === normalizedDate.getTime()
      );

      if (!newDayEntry) {
        // If the new date does not exist, create a new day entry
        newDayEntry = {
          date: normalizedDate,
          meals: [],
        };
        user.mealLog.push(newDayEntry);
      }

      // Add the meal to the new day's meals array
      newDayEntry.meals.push(updatedMeal);
    }

    // Step 8: Save the updated user document
    await user.save();

    // Step 9: Respond with the updated meal
    res.status(200).json({ message: 'Meal updated successfully.', meal: updatedMeal });
  } catch (error) {
    console.error('Error updating meal:', error);
    res.status(500).json({ error: 'An error occurred while updating the meal.' });
  }
});

module.exports = router;