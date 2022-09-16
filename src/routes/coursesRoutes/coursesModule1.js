/**
File handling the COURSES Module 1 in database 
*/

/*** ENDPOINTS:
1. GET - fetches all courses stored to data base => from "coursesModule1" collection
2. POST - creates a new course; stores it to "coursesModule1" collection
3. PUT - modifies various entries in the course object
4. PATCH - makes the course ACTIVE / INACTIVE
5. DELETE - removes the course from the data base
*/

const express = require("express");
const router = express.Router();
const coursesModule1 = require('../../controllers/coursesControllers/coursesModule1');


router.route('/courses-module1')
  .get(coursesModule1.getCourses)

  .post(coursesModule1.addNewCourse)

  .put(coursesModule1.updateCourse)

  .patch(coursesModule1.updateCourseState)

  .delete(coursesModule1.deleteCourse)


module.exports = router;