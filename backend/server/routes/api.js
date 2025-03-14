const express = require('express');
const axios = require('axios');
const router = express.Router();

// Load environment variables
require('dotenv').config();
const API_KEY = process.env.API_KEY; // Ensure you have this in your .env file

// Define the /api/query route
router.post('/query', async (req, res) => {
  const { prompt } = req.body;

  format_info = "\n In JSON format please show the default nutritional number values of the food, as a single combined meal entry:\n                 Name: <name of food>\n                 Calories: <number of calories in KC>\n                 Carbs: <number of carbs>\n                 Protein: <number of protein>\n                 Fat: <number of fat>\n                 Fiber: <number of fiber>\n                 Sugar: <number of sugar>\n                 Sodium: <number of sodium>\n                 Cholesterol: <number of cholesterol>\n                 Vitamin A: <number of vitamin A>\n                 Vitamin B2: <number of vitamin B2>\n                 Vitamin B6: <number of vitamin B6>\n                 Vitamin B12: <number of vitamin B12>\n                 Vitamin C: <number of vitamin C>\n                 Vitamin D: <number of vitamin D>\n                 Vitamin E: <number of vitamin E>\n                 Vitamin K: <number of vitamin K>\n                 Calcium: <number of calcium>\n                 Iron: <number of iron>\n                 Magnesium: <number of magnesium>\n                 Potassium: <number of potassium>\n                 Zinc: <number of zinc>\n"

  if (!prompt) {
    return res.status(400).json({ error: "'prompt' field is required" });
  }

  try {
    const response = await axios.post('http://localhost:1234/v1/chat/completions', {
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