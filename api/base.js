const mongo = require('mongoose');
// Config
const { MONGODB_URI } = require('../config');

/*
    Declare
*/
// Base
let base;
const base_name = 'blog';


const Connect = async () => {
    console.log("[api:base] Connecting to url: " + MONGODB_URI);
    mongo.connect(
        MONGODB_URI,
        {
            dbName: base_name,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then((client) => {
        // Not required if dbName is used as option
        base = client.connection;
        console.log("[api:base] Connected...");
    })
    .catch((err) =>
        {
            console.error("[api:base] Error Connecting to mongodb.\n[api:base] " + err.message);
            return
        }
    );
}



const isBaseConnected = () => {
    return !(base === undefined)
}


const getBaseStats = () => {
    // Log
    // console.log("[log] ", base);
    is_base_connected = isBaseConnected() ? "connected" : "not connected" ;
    return { base: is_base_connected };
}



/*
    Exports
*/
module.exports = {
    // Connect Functions
    Connect,
    isBaseConnected,
    getBaseStats,
    // Util Functions

};