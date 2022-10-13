const express = require("express");
const router = express.Router();
const studentData = require('../../controllers/studentsControllers/getStudentData');


router.route('/get-student-data-by-name')
  .post(studentData.getStudentDataByStudentName)

router.route('/get-student-data-by-email')
  .post(studentData.getStudentDataByStudentEmail)

module.exports = router;