// Import necessary modules and routes
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const dbConnection = require('./config/db.config');

//user routes
const loginRoute = require('./routes/user/login');
const registerRoute = require('./routes/user/signup');
const getAllUsersRoute = require('./routes/user/getAll');
const getUserByIdRoute = require('./routes/user/getById');
const editUserRoute = require('./routes/user/edit');
const deleteUserByIDRoute = require('./routes/user/deleteByID');
const verifyPassword = require('./routes/user/verifyPassword');
//meal logging routes
const deleteMealRoute = require('./routes/meal/delete');
const editMealRoute = require('./routes/meal/edit');
const getAllMealRoute = require('./routes/meal/getAllById');
const getMealRoute = require('./routes/meal/getById');
const logMealRoute = require('./routes/meal/logMeal');


// Load environment variables
require('dotenv').config();
const SERVER_PORT = 8081

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/user', loginRoute);
app.use('/user', registerRoute);
app.use('/user', getAllUsersRoute);
app.use('/user', getUserByIdRoute);
app.use('/user', editUserRoute);
app.use('/user', deleteUserByIDRoute);
app.use('/user', verifyPassword);

app.use('/user', deleteMealRoute)
app.use('/user', editMealRoute)
app.use('/user', getAllMealRoute)
app.use('/user', getMealRoute)
app.use('/user', logMealRoute)

console.log(`The node environment is: ${process.env.NODE_ENV}`);


// Production environment: connect to the database and start listening for requests
if (process.env.NODE_ENV !=="test") {
    dbConnection();
    app.listen(SERVER_PORT, () => {
      setTimeout(() => {
        console.log(`All services are running on port: ${SERVER_PORT}`);
      }, 1000); // Add a 1-second delay
    });
}


module.exports = app; // Export the app instance for unit testing via supertest.