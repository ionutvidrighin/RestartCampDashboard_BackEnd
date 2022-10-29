const express = require("express");
const router = express.Router();
const email3DaysAfterRegistrationCompany = require('../../controllers/emailTemplatesControllers/email3DaysAfterRegistrationBusiness');

router.get('/get-email-3days-company-subject-template', email3DaysAfterRegistrationCompany.getCurrentEmailTemplateSubject)

router.post('/update-email-3days-company-subject-template', email3DaysAfterRegistrationCompany.updateEmailSubject)

router.post('/upload-email-3days-company-template', email3DaysAfterRegistrationCompany.uploadFile)

router.post('/test-email-3days-company-template', email3DaysAfterRegistrationCompany.sendTestEmailTemplate)

router.get('/download-email-3days-company-template', email3DaysAfterRegistrationCompany.downloadFile)

router.get('/render-email-3days-company-template', email3DaysAfterRegistrationCompany.renderTemplate)


module.exports = router;