const MONGODB_URI=process.env.MONGODB_URI || "";
const CHECKS_ENABLED = process.env.CHECKS_ENABLED === "true" || false;

// Export
module.exports = { 
    MONGODB_URI,
    CHECKS_ENABLED
};