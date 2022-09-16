const express = require("express");
const router = express.Router();
const studentsRegisteredCourseModule1 = require('../../controllers/studentsControllers/studentsRegisteredCourseModule1');

router.route('/get-students-by-year-month')
  .post(studentsRegisteredCourseModule1.getStudentsByYearMonth)

router.route('/get-students-by-course-name-and-career')
  .post(studentsRegisteredCourseModule1.getStudentsByCourseNameAndCareer)


module.exports = router