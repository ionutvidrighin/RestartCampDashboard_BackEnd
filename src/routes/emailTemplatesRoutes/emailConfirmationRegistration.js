const express = require("express");
const router = express.Router();
const emailConfirmationRegistration = require('../../controllers/emailTemplatesControllers/emailConfirmationRegistration');
  
router.post('/upload-email-confirmation-template', emailConfirmationRegistration.uploadFile)

router.post('/test-email-confirmation-registration', emailConfirmationRegistration.sendTestEmailTemplate)

router.get('/download-email-confirmation-template', emailConfirmationRegistration.downloadFile)

router.get('/render-email-confirmation-template', emailConfirmationRegistration.renderTemplate)


module.exports = router;