const express = require("express");
const router = express.Router();
const email3DaysAfterRegistrationBusiness = require('../../controllers/emailTemplatesControllers/email3DaysAfterRegistrationBusiness');

router.route('/email-3days-after-registration-company')
  .get(email3DaysAfterRegistrationBusiness.getEmailTemplate)

  .post(email3DaysAfterRegistrationBusiness.updateEmailTemplate)

router.route('/test-email-3days-after-registration-company')
  .post(email3DaysAfterRegistrationBusiness.sendEmailTemplate)


module.exports = router;