const express = require("express");
const router = express.Router();
const emailReminder1Hour = require('../../controllers/emailTemplatesControllers/emailReminder1hour');

router.get('/get-email-reminder-1hour-subject-template', emailReminder1Hour.getCurrentEmailTemplateSubject)

router.post('/upload-email-reminder-1hour-subject-template', emailReminder1Hour.updateEmailSubject)

router.post('/upload-email-reminder-1hour-template', emailReminder1Hour.uploadFile)

router.post('/test-email-reminder-1hour-template', emailReminder1Hour.sendTestEmailTemplate)

router.get('/download-email-reminder-1hour-template', emailReminder1Hour.downloadFile)

router.get('/render-email-reminder-1hour-template', emailReminder1Hour.renderTemplate)


module.exports = router;