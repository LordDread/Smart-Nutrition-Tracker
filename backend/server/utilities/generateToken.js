const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateAccessToken = (userId, email, username) => {
    return jwt.sign(
        { id: userId, email, username }, // Omit password from the token payload
        process.env.ACCESS_TOKEN_SECRET,  // Secret key for signing the token
        { expiresIn: '1h' }  // Set expiration time (e.g., 1 hour)
    );
}

module.exports.generateAccessToken = generateAccessToken;