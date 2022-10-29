const express = require("express");
const router = express.Router();
const emailVoucher18hours = require('../../controllers/emailTemplatesControllers/emailVoucher18hoursAfterCourse');

router.get('/get-email-voucher-18hours-subject-template', emailVoucher18hours.getCurrentEmailTemplateSubject)

router.post('/upload-email-voucher-18hours-subject-template', emailVoucher18hours.updateEmailSubject)

router.post('/upload-email-voucher-18hours-template', emailVoucher18hours.uploadFile)

router.post('/test-email-voucher-18hours-template', emailVoucher18hours.sendTestEmailTemplate)

router.get('/download-email-voucher-18hours-template', emailVoucher18hours.downloadFile)

router.get('/render-email-voucher-18hours-template', emailVoucher18hours.renderTemplate)


module.exports = router;