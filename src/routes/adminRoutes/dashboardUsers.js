const express = require("express");
const router = express.Router();
const dashboardUsers = require('../../controllers/adminControllers/dashboardUsers');

router.route('/get-dashboard-users')
  .get(dashboardUsers.getDashboardUsers)

router.route('/create-dashboard-user')
  .post(dashboardUsers.createDashboardUser)

router.route('/change-user-permission')
  .put(dashboardUsers.changeDashbordUserPermission)

router.route('/delete-dashboard-user')
  .delete(dashboardUsers.deleteDashboardUser)


module.exports = router