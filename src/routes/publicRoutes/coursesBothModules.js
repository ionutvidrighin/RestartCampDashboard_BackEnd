const express = require("express");
const router = express.Router();
const getAllCourses = require('../../controllers/publicControllers/coursesBothModules');

router.route('/restart-camp-courses')
  .get(getAllCourses)

module.exports = router;
