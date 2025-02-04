const express = require("express");
const router = express.Router();
const z = require('zod');
const bcrypt = require("bcrypt");
const userModel = require('../../models/userModel');
const { userValidation } = require('../../models/userValidator');
const { generateAccessToken } = require('../../utilities/generateToken');

router.put('/edit', async (req, res) => {
  // Validate user information
  const { error } = userValidation(req.body);
  if (error) return res.status(400).send({ message: error.errors[0].message });

  const { userId, username, email, password } = req.body;

  try {
    // Find the user by userId (ensure the user exists)
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).send({ message: "User not found" });

    // Check if the username is already taken by another user
    const usernameConflict = await userModel.findOne({ username });
    if (usernameConflict && usernameConflict._id.toString() !== userId) {
      return res.status(409).send({ message: "Username is taken, pick another" });
    }

    // Prepare the user data to update
    const updatedData = { username, email, password };

    // If the password is being updated, hash it
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    // Update the user in the database
    const updatedUser = await userModel.findByIdAndUpdate(userId, updatedData, { new: true });

    // Generate a new access token for the updated user
    const accessToken = generateAccessToken(updatedUser._id, updatedUser.email, updatedUser.username);

    // Respond with the updated user data and the new access token
    res.header('Authorization', accessToken).send({
      accessToken,
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
