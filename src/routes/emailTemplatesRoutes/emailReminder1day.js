const express = require("express");
const router = express.Router();
const emailReminder1Day = require('../../controllers/emailTemplatesControllers/emailReminder1day');


router.post('/upload-email-reminder-1day-template', emailReminder1Day.uploadFile)

router.post('/test-email-reminder-1day-template', emailReminder1Day.sendTestEmailTemplate)

router.get('/download-email-reminder-1day-template', emailReminder1Day.downloadFile)

router.get('/render-email-reminder-1day-template', emailReminder1Day.renderTemplate)


module.exports = router;