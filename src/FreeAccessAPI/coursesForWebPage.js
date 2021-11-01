const express = require("express");
const router = express.Router();
let freeCourses = require('../freeCourses/courses');
let paidCourses = require('../paidCourses/courses');

router.route('/restart-camp-courses')
  .get( (req, res) => {
    res.status(200).json({freeCourses, paidCourses})
  })


module.exports = router;