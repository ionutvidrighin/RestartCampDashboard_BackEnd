const express = require("express");
const router = express.Router();
const emailVoucher4hours = require('../../controllers/emailTemplatesControllers/emailVoucher4hoursAfterCourse');

router.get('/get-email-voucher-4hours-subject-template', emailVoucher4hours.getCurrentEmailTemplateSubject)

router.post('/upload-email-voucher-4hours-subject-template', emailVoucher4hours.updateEmailSubject)

router.post('/upload-email-voucher-4hours-template', emailVoucher4hours.uploadFile)

router.post('/test-email-voucher-4hours-template', emailVoucher4hours.sendTestEmailTemplate)

router.get('/download-email-voucher-4hours-template', emailVoucher4hours.downloadFile)

router.get('/render-email-voucher-4hours-template', emailVoucher4hours.renderTemplate)


module.exports = router;