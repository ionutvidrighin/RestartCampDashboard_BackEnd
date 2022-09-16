const express = require("express");
const router = express.Router();
const registerStudent = require('../../controllers/publicControllers/registerStudent');

router.route('/register-student')
  .post(registerStudent.registerNewStudent)

router.route('/get-course-for-presence-confirm')
  .post(registerStudent.getCourseForPresenceConfirmByCourseId)

router.route('/confirm-student-presence-at-course')
  .put(registerStudent.confirmStudentPresenceAtCourse)

module.exports = router;