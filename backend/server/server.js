// Import necessary modules and routes
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const dbConnection = require('./config/db.config');


const loginRoute = require('./routes/user/login');
const getAllUsersRoute = require('./routes/user/getAllUsers');
const registerRoute = require('./routes/user/signUp');
const getUserByIdRoute = require('./routes/user/getUserById');
const editUserRoute = require('./routes/user/editUser');
const deleteUserByIDRoute = require('./routes/user/deleteByID');


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