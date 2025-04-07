const express = require("express");
const router = express.Router();
const z = require('zod')
const bcrypt = require("bcrypt");
const { userValidation } = require('../../models/userValidator')
const userModel = require('../../models/userModel')

router.post('/signup', async (req, res) => {
    const { error } = userValidation(req.body);
    if (error) {
        console.log(error);  // Log the entire error object
        return res.status(400).send({ message: error.errors[0].message });
    } else {
        console.log('Validation passed!');  // Log success when validation passes
    }
    const { username, email, password } = req.body

    //check if email already exists
    const user = await userModel.findOne({ username: username })
    if (user)
        return res.status(409).send({ message: "Username is taken, pick another" })

    // generate a hash and parse it into the password
    const hashPassword = await bcrypt.hash(password, 10)

    //creates a new user
    const createUser = new userModel({
        username: username,
        email: email,
        password: hashPassword,
    });
    
   
    try {
        const saveNewUser = await createUser.save();
        res.send(saveNewUser);
    } catch (error) {
        res.status(400).send({ message: "Error trying to create new user" });
    }

})

module.exports = router;
