const express = require("express");
const router = express.Router();
const registerStudentPresence = require('../../controllers/publicControllers/registerStudentPresenceAtCourse');

router.route('/get-course-for-presence-confirm')
.post(registerStudentPresence.getCourseForPresenceConfirmByCourseId)

router.route('/confirm-student-presence-at-course')
.put(registerStudentPresence.confirmStudentPresenceAtCourse)

module.exports = router;