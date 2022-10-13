const express = require("express");
const router = express.Router();
const unsubscribeOrRemoveStudent = require('../../controllers/studentsControllers/unsubscribeOrRemoveStudent');

router.route('/unsubscribe-student')
  .put(unsubscribeOrRemoveStudent.replaceStudentEmailAddress)

router.route('/remove-student')
  .put(unsubscribeOrRemoveStudent.replaceStudentNameAndEmailAddress)


module.exports = router;



