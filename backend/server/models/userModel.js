const mongoose = require("mongoose");
const mealSchema = require('./mealSchema');  // Import mealSchema

//user schema/model
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
      trim: true
    },
    date: {
      type: Date,
      default: Date.now,
    },
    mealLog: [mealSchema],
  },
  { collection: "users" }
);

module.exports = mongoose.model('users', newUserSchema)