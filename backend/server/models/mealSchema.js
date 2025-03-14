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
  carbs: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },
  fiber: {
    type: Number,
    required: true,
  },
  sugar: {
    type: Number,
    required: true,
  },
  sodium: {
    type: Number,
    required: true,
  },
  cholesterol: {
    type: Number,
    required: true,
  },
  vitaminA: {
    type: Number,
    required: true,
  },
  vitaminB2: {
    type: Number,
    required: true,
  },
  vitaminB6: {
    type: Number,
    required: true,
  },
  vitaminB12: {
    type: Number,
    required: true,
  },
  vitaminC: {
    type: Number,
    required: true,
  },
  vitaminD: {
    type: Number,
    required: true,
  },
  vitaminE: {
    type: Number,
    required: true,
  },
  vitaminK: {
    type: Number,
    required: true,
  },
  calcium: {
    type: Number,
    required: true,
  },
  iron: {
    type: Number,
    required: true,
  },
  magnesium: {
    type: Number,
    required: true,
  },
  potassium: {
    type: Number,
    required: true,
  },
  zinc: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: '',
  }
}, { _id: true });

module.exports = mealSchema;