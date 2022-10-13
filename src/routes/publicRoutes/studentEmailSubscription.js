const express = require("express");
const router = express.Router();
const emailSubscription = require('../../controllers/publicControllers/studentEmailSubscription');

router.route('/subscribe-student')
  .post(emailSubscription.subscribeStudentToEmails)
  
router.route('/unsubscribe-student')
  .post(emailSubscription.unsubscribeStudentFromEmails)

module.exports = router
