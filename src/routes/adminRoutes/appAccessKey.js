const express = require("express");
const router = express.Router();
const appAccessKey = require('../../controllers/adminControllers/appAccessKey');

router.route('/app-access-key')
  .get(appAccessKey.getCurrentAppAccessKey)

  .put(appAccessKey.updateAppAccessKey)


module.exports = router