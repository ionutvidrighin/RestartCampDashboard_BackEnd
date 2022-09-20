const express = require("express");
const router = express.Router();
const generateDatabaseToken = require('../controllers/databaseAccess');

router.post('/generate-database-token', generateDatabaseToken)

module.exports = router