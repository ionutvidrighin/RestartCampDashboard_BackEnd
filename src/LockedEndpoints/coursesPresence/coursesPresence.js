const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../../faunaDB");
const coursePresenceData = require('./coursePresenceData_JSON')

router.route('/course-presence')
  .get((req, res) => {
    res.status(200).json(coursePresenceData)
  })

module.exports = router