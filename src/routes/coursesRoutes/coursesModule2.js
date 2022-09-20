/**
File handling the COURSES Module 2 in database
*/

/*** ENDPOINTS:
1. GET - fetches all courses stored to data base => "coursesModule2" collection
2. POST - creates a new course; stores it to "coursesModule2" collection
3. PUT - modifies various entries in the course object
4. PATCH - makes the course ACTIVE / INACTIVE
5. DELETE - removes the course from the data base
*/

const express = require("express");
const router = express.Router();
const coursesModule2 = require('../../controllers/coursesControllers/coursesModule2');

router.route('/courses-module2')
  .get(coursesModule2.getCourses)

  .post(coursesModule2.addNewCourse)

  .put(coursesModule2.updateCourse)

  .patch(coursesModule2.toggleCourseState)

  .delete(coursesModule2.deleteCourse)


module.exports = router;