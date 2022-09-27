const express = require("express");
const router = express.Router();
const emailVoucher40hours = require('../../controllers/emailTemplatesControllers/emailVoucher40hoursAfterCourse');


router.post('/upload-email-voucher-40hours-template', emailVoucher40hours.uploadFile)

router.post('/test-email-voucher-40hours-template', emailVoucher40hours.sendTestEmailTemplate)

router.get('/download-email-voucher-40hours-template', emailVoucher40hours.downloadFile)

router.get('/render-email-voucher-40hours-template', emailVoucher40hours.renderTemplate)


module.exports = router;