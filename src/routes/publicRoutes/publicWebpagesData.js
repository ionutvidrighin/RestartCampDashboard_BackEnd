const express = require("express");
const router = express.Router();
const publicWebpagesData = require('../../controllers/publicControllers/publicWebpagesData');

router.route('/courses-page-data')
  .get(publicWebpagesData.getCoursesPageData)

router.route('/course-presence-page-data')
  .get(publicWebpagesData.getCoursesPresencePageData)

router.route('/header-footer-data')
  .get(publicWebpagesData.getHeaderFooterData)

router.route('/registration-form-alerts')
  .get(publicWebpagesData.getRegistrationFormAlerts)

module.exports = router;