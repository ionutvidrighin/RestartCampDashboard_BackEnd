const express = require("express");
const router = express.Router();
const studentsPresence = require('../../controllers/studentsControllers/studentsPresenceCourseModule1');


router.route('/get-course-presence')
  .post(studentsPresence.getStudentPresenceAtCourseModule1)

router.route('/get-students-whatsapp-numbers')
  .post(studentsPresence.getStudentsWhatsappNumbers)

module.exports = router