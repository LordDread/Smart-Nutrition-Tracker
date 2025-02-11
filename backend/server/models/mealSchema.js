const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for a single meal entry
const mealSchema = new Schema({
  mealName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: '',
  } 
}, { _id: true });

module.exports = mealSchema;