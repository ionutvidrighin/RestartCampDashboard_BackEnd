const express = require("express");
const router = express.Router();
const emailConfirmationRegistration = require('../../controllers/emailTemplatesControllers/emailConfirmationRegistration');

router.route('/email-confirmation-registration')
  .get(emailConfirmationRegistration.getEmailTemplate)

  .post(emailConfirmationRegistration.updateEmailTemplate)

router.route('/test-email-confirmation-registration')
  .post(emailConfirmationRegistration.sendTestEmailTemplate)

module.exports = router;