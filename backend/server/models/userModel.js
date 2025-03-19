const mongoose = require("mongoose");
const dayMealsSchema = require('./mealSchema'); // Import dayMealsSchema

// User schema/model
const newUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      label: "username",
      minlength: 6,
    },
    email: {
      type: String,
      required: true,
      label: "email",
    },
    password: {
      required: true,
      type: String,
      minlength: 8,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    mealLog: [dayMealsSchema], // Array of dayMealsSchema
  },
  { collection: "users" }
);

module.exports = mongoose.model('users', newUserSchema);