const express = require('express');
const axios = require('axios');
const router = express.Router();

// Load environment variables
require('dotenv').config();
const API_KEY = process.env.API_KEY; // Ensure you have this in your .env file

// Define the /api/query route
router.post('/query', async (req, res) => {
  const { prompt } = req.body;  

  try {
    const response = await axios.post('http://localhost:1234/v1/completions', {
      model: "deepseek-r1-distill-llama-8b",
      prompt: prompt      
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error querying LM Studio:', error);
    console.error('Error details:', error.response ? error.response.data : error.message);
    res.status(500).send('Error querying LM Studio');
  }
});

module.exports = router;