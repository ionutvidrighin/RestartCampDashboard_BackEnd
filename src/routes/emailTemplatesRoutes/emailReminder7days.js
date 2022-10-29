const express = require("express");
const router = express.Router();
const emailReminder7Days = require('../../controllers/emailTemplatesControllers/emailReminder7days');

router.get('/get-email-reminder-7days-subject-template', emailReminder7Days.getCurrentEmailTemplateSubject)

router.post('/upload-email-reminder-7days-subject-template', emailReminder7Days.updateEmailSubject)

router.post('/upload-email-reminder-7days-template', emailReminder7Days.uploadFile)

router.post('/test-email-reminder-7days-template', emailReminder7Days.sendTestEmailTemplate)

router.get('/download-email-reminder-7days-template', emailReminder7Days.downloadFile)

router.get('/render-email-reminder-7days-template', emailReminder7Days.renderTemplate)


module.exports = router;