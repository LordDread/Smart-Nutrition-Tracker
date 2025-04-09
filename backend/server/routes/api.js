const express = require('express');
const axios = require('axios');
const router = express.Router();

// Load environment variables
require('dotenv').config();
const API_KEY = process.env.API_KEY; // Ensure you have this in your .env file

// Define the /api/query route
router.post('/query', async (req, res) => {
  const { prompt } = req.body;

  format_info = "\n In JSON format please show the default nutritional number values of the food, as a single combined meal entry:\n                 Name: <name of food>\n                 calories: <number of calories in KC>\n                 carbs: <number of carbs>\n                 protein: <number of protein>\n                 fat: <number of fat>\n                 fiber: <number of fiber>\n                 sugar: <number of sugar>\n                 sodium: <number of sodium>\n                 cholesterol: <number of cholesterol>\n                 vitaminA: <number of vitamin A>\n                 vitaminB2: <number of vitamin B2>\n                 vitaminB6: <number of vitamin B6>\n                 vitaminB12: <number of vitamin B12>\n                 vitaminC: <number of vitamin C>\n                 vitaminD: <number of vitamin D>\n                 vitaminE: <number of vitamin E>\n                 vitaminK: <number of vitamin K>\n                 calcium: <number of calcium>\n                 iron: <number of iron>\n                 magnesium: <number of magnesium>\n                 potassium: <number of potassium>\n                 zinc: <number of zinc>\n"

  if (!prompt) {
    return res.status(400).json({ error: "'prompt' field is required" });
  }

  try {
    const response = await axios.post(`${process.env.API_QUERY_URI}/v1/chat/completions`, {
      model: "deepseek-r1-distill-llama-8b",
      messages: [
        { role: "system", content: format_info },
        { role: "user", content: "In JSON: " + prompt }
      ]      
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    // Extract the JSON part from the response
    const jsonResponse = response.data.choices[0].message.content.trim();
    const jsonStartIndex = jsonResponse.indexOf('{');
    const jsonEndIndex = jsonResponse.lastIndexOf('}') + 1;
    const jsonContent = jsonResponse.substring(jsonStartIndex, jsonEndIndex);

    res.json(JSON.parse(jsonContent));
  } catch (error) {
    console.error('Error querying LM Studio:', error);
    console.error('Error details:', error.response ? error.response.data : error.message);
    res.status(500).send('Error querying LM Studio');
  }
});

module.exports = router;