const express = require("express");
const router = express.Router();
const email3DaysAfterRegistrationEmployee = require('../../controllers/emailTemplatesControllers/email3DaysAfterRegistrationEmployee');

router.route('/email-3days-after-registration-employee')
  .get(email3DaysAfterRegistrationEmployee.getEmailTemplate)

  .post(email3DaysAfterRegistrationEmployee.updateEmailTemplate)

router.route('/test-email-3days-after-registration-employee')
  .post(email3DaysAfterRegistrationEmployee.sendEmailTemplate)


module.exports = router;