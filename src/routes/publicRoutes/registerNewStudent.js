const express = require("express");
const router = express.Router();
const registerNewStudent = require('../../controllers/publicControllers/registerNewStudent');

router.route('/register-student')
  .post(registerNewStudent)

module.exports = router;