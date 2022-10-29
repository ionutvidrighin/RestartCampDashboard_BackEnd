const express = require("express");
const router = express.Router();
const emailConfirmationRegistration = require('../../controllers/emailTemplatesControllers/emailConfirmationRegistration');

router.get('/get-email-confirmation-subject-template', emailConfirmationRegistration.getCurrentEmailTemplateSubject)

router.post('/update-email-confirmation-subject-template', emailConfirmationRegistration.updateEmailSubject)

router.post('/upload-email-confirmation-template', emailConfirmationRegistration.uploadFile)

router.post('/test-email-confirmation-registration', emailConfirmationRegistration.sendTestEmailTemplate)

router.get('/download-email-confirmation-template', emailConfirmationRegistration.downloadFile)

router.get('/render-email-confirmation-template', emailConfirmationRegistration.renderTemplate)


module.exports = router;