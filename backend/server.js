// Import necessary modules and routes
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const dbConnection = require('./server/config/db.config');
const apiRoute = require('./server/routes/api'); // Import the new API route

// User routes
const loginRoute = require('./server/routes/user/login');
const registerRoute = require('./server/routes/user/signup');
const getAllUsersRoute = require('./server/routes/user/getAll');
const getUserByIdRoute = require('./server/routes/user/getById');
const editUserRoute = require('./server/routes/user/edit');
const deleteUserByIDRoute = require('./server/routes/user/deleteByID');
const verifyPassword = require('./server/routes/user/verifyPassword');

// Meal logging routes
const deleteMealRoute = require('./server/routes/meal/delete');
const editMealRoute = require('./server/routes/meal/edit');
const getAllMealRoute = require('./server/routes/meal/getAllById');
const getMealRoute = require('./server/routes/meal/getById');
const logMealRoute = require('./server/routes/meal/logMeal');

// Load environment variables
require('dotenv').config();
const SERVER_PORT = process.env.PORT || 8081;
const API_KEY = process.env.API_KEY; // Ensure you have this in your .env file

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({ origin: '*' }));
app.use(express.json());

// User routes
app.use('/user', loginRoute);
app.use('/user', registerRoute);
app.use('/user', getAllUsersRoute);
app.use('/user', getUserByIdRoute);
app.use('/user', editUserRoute);
app.use('/user', deleteUserByIDRoute);
app.use('/user', verifyPassword);

// Meal logging routes
app.use('/user', deleteMealRoute);
app.use('/user', editMealRoute);
app.use('/user', getAllMealRoute);
app.use('/user', getMealRoute);
app.use('/user', logMealRoute);

// Use the new API route
app.use('/api', apiRoute);

console.log(`The node environment is: ${process.env.NODE_ENV}`);

// Production environment: connect to the database and start listening for requests
if (process.env.NODE_ENV !== "test") {
  dbConnection();
  app.listen(SERVER_PORT, () => {
    setTimeout(() => {
      console.log(`All services are running on port: ${SERVER_PORT}`);
    }, 1000); // Add a 1-second delay
  });
}

module.exports = app; // Export the app instance for unit testing via supertest