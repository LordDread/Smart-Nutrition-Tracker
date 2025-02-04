const express = require("express");
const router = express.Router();
const userModel = require("../../models/userModel");

router.get("/getById", async (req, res) => {
  const { userId } = req.query; // Accessing the userId from the query string

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send("userId does not exist.");
    }
    res.json(user); // Return the user
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;