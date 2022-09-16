const express = require("express");
const router = express.Router();
const getStudentPresenceAtCourseModule1 = require('../../controllers/studentsControllers/studentsPresenceCourseModule1');


router.route('/get-course-presence')
  .post(getStudentPresenceAtCourseModule1)

module.exports = router