/*
    Imports
*/

// ExpressJs and Routes
const { Route } = require('express');
const express = require('express');
const bodyParser = require('body-parser');
// Environment Variables
require('dotenv').config();
// CORS Fix
var cors = require('cors');

// Base
const base = require('./api/base');

/*
    Server Code
*/


// Express App
app = express();
app.use(cors());
app.use(cors());
// Parse url encoded form data
app.use(bodyParser.urlencoded({
    // For debugging
    verify: (req, res, buf) => {
        req.rawBody = buf
    }
}))

// Routes
const routeIndex = require('./src/index');
var routeApi = require('./src/routes/api');
app.use("/", routeIndex);
app.use('/api', routeApi);



/*
    Run the Server
*/

// Run Express
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log("[app:express] The Server is now running on port: " + PORT)
    // Connect Base
    base.Connect()
}).on('error', (e) => {
    console.error("[app:express] Error, Server cannot start.\n[app:express] " + e.message)
});