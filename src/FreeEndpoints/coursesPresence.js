const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../faunaDB");

router.route('/course-presence')
  .post((req, res) => {
    res.status(200).json(coursePresenceData)
  })

module.exports = router