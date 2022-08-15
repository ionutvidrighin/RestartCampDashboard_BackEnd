const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../FaunaDataBase/faunaDB");
const indexes = require("../FaunaDataBase/indexes");

const { Match, Map, Paginate, Get, Update, Ref, Collection, Lambda, Index, Var} = faunaDB.query;

router.route('/get-course-data-for-presence-confirmation')
  .post(async (req, res) => {
    const courseId = req.body.courseId

    try {
      const getCourseData = await faunaClient.query(
        Map(
          Paginate(Match(Index(indexes.GET_COURSE_FOR_PRESENCE_CONFIRMATION_BY_ID), courseId)),
          Lambda("student", Get(Var("student")))
        )
      )
  
      res.status(200).json(getCourseData.data[0].data.course)
  
    } catch (error) {
      res.status(404).json(error)
    }
  })

class CheckStudentBeforePresenceConfirmation {
  constructor(input) {
    this.fullName = input.fullName
    this.email = input.email,
    this.courseId = input.courseId
  }
}


router.route('/confirm-student-presence')
  .post( async (request, response) => {
    const payload = request.body
    const studentObject = new CheckStudentBeforePresenceConfirmation(payload)

    let undefinedValues;
    Object.values(studentObject).forEach(value => {
      if (value === undefined) undefinedValues = true
    })

    // throw Error if payload passed from FrontEnd is incorrect
    if (undefinedValues) {
      response.status(422).json({
        error: "Passed data can't be undefined. Please check all key/values in your payload Object",
        tip: "Payload Object must contain following data: **fullName, email, courseId **"
      })
      return
    }

    try {
      const searchStudentInDB = await faunaClient.query(
        Map(
          Paginate(Match(Index(indexes.GET_STUDENT_FOR_PRESENCE_CONFIRMATION_BY_COURSE_ID), studentObject.courseId)),
          Lambda("student", Get(Var("student")))
        )
      )
      console.log(searchStudentInDB)
      response.status(200).json(searchStudentInDB.data[0].data)
    } catch (error) {
      response.status(404).json(error)
    }
  })

module.exports = router