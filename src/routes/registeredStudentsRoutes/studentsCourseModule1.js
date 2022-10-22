const express = require("express");
const router = express.Router();
const studentsRegisteredCourseModule1 = require('../../controllers/studentsControllers/studentsRegisteredCourseModule1');

router.route('/get-all-students-data')
  .post(studentsRegisteredCourseModule1.getAllStudentsData)

router.route('/get-students-by-year-month')
  .post(studentsRegisteredCourseModule1.getStudentsByYearMonth)

router.route('/get-students-by-course-name-and-career')
  .post(studentsRegisteredCourseModule1.getStudentsByCourseNameAndCareer)

router.route('/get-students-without-unsubscribed-and-deleted')
  .post(studentsRegisteredCourseModule1.getStudentsWithoutUnsubscribedAndDeleted)


module.exports = router