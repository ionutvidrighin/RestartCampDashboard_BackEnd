const express = require("express");
const router = express.Router();
const updateWebpagesData = require('../../controllers/updateWebpagesControllers/updateWebpagesData');

router.route('/courses-page-data')
  .put(updateWebpagesData.updateCoursesPageData)

router.route('/course-presence-page-data')
  .put(updateWebpagesData.updateCoursesPresencePageData)

router.route('/header-footer-data')
  .put(updateWebpagesData.updateHeaderFooterData)

router.route('/registration-form-alerts')
  .put(updateWebpagesData.updateRegistrationFormAlerts)
  

module.exports = router