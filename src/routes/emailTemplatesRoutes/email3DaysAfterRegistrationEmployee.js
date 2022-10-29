const express = require("express");
const router = express.Router();
const email3DaysAfterRegistrationEmployee = require('../../controllers/emailTemplatesControllers/email3DaysAfterRegistrationEmployee');

router.get('/get-email-3days-employee-subject-template', email3DaysAfterRegistrationEmployee.getCurrentEmailTemplateSubject)

router.post('/update-email-3days-employee-subject-template', email3DaysAfterRegistrationEmployee.updateEmailSubject)

router.post('/upload-email-3days-employee-template', email3DaysAfterRegistrationEmployee.uploadFile)

router.post('/test-email-3days-employee-template', email3DaysAfterRegistrationEmployee.sendTestEmailTemplate)

router.get('/download-email-3days-employee-template', email3DaysAfterRegistrationEmployee.downloadFile)

router.get('/render-email-3days-employee-template', email3DaysAfterRegistrationEmployee.renderTemplate)


module.exports = router;