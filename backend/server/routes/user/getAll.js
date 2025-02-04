const express = require("express");
const router = express.Router();
const userModel = require('../../models/userModel')

router.get('/getAll', async (req, res) => {
    const user = await userModel.find();
    return res.json(user)
  })

  module.exports = router;