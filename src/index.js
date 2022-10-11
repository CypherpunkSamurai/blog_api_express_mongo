// Routing
const router = require('express').Router();
// Base
const { getBaseStats } = require('../api/base');

/*
    Root
*/
router.get("/", async (req, res) => {
    // Routes the request and response
    var stats = getBaseStats()
    res.status(200).json({status: "running", stats: stats});
    return;
})


/*
    Exports
*/
module.exports = [
    router
];