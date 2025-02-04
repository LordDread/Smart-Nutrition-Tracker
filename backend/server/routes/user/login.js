const express = require("express");
const router = express.Router();
const z = require('zod')
const { loginValidation } = require('../../models/userValidator')
const userModel = require('../../models/userModel')
const bcrypt = require('bcrypt')
const { generateAccessToken } = require('../../utilities/generateToken')


router.post('/login', async (req, res) => {

  const validationResult = loginValidation(req.body);
  if (!validationResult.success) {
    return res.status(400).send({ message: validationResult.error.errors[0].message });
  }

  const { username, password } = req.body

  let user;
  try {
    user = await userModel.findOne({ username: username });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal server error" });
  }

  //checks if the user exists
  if (!user)
    return res
      .status(401)
      .send({ message: "Invalid credentials, please try again" });

  //check if the password is correct or not
  const checkPasswordValidity = await bcrypt.compare(
    password,
    user.password
  );

  if (!checkPasswordValidity)
    return res
      .status(401)
      .send({ message: "Invalid credentials, please try again" });

  //create json web token if authenticated and send it back to client in header where it is stored in localStorage ( might not be best practice )
  const accessToken = generateAccessToken(user._id, user.email, user.username)

  res.header('Authorization', accessToken).send({ accessToken: accessToken })
})

module.exports = router;