const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const indexes = require("../../FaunaDataBase/indexes");
const collections = require('../../FaunaDataBase/collections');
const getAccessKey = require("../../Authentication/getAccessKey");
const dayjs = require('dayjs');
const { Union } = require("faunadb");

const { Map, Create, Intersection, Delete, Collection, Paginate, Match, Documents, Get, Lambda, Update, Ref, Index, Var } = faunaDB.query
const currentYear = dayjs().year()
const currentMonth = dayjs().month() + 1 // Months count, starts from 0 with dayjs library

// Function getting the needed data from DB based on date in String format, as "YYYY-MM"
const getRegisteredStudents = async (date) => {
  const currentYearAndMonth = `${currentYear}-${currentMonth < 10 ? '0'+currentMonth : currentMonth}`

  try {
    const dataFromDB = await faunaClient.query(
      Map(
        Paginate(Match(Index(indexes.GET_STUDENTS_BY_YEAR_MONTH), date === undefined ? currentYearAndMonth : date)),
        Lambda("students", Get(Var("students")))
      )
    )
    let returnedData = dataFromDB.data
    returnedData = returnedData.map(item => item.data)
    return returnedData
  } catch (error) {
    return error
  }
}

router.route('/get-students-by-year-month')
  .get(async (req, res) => {
    const accessKey = req.headers.authorization
    const appAccessKey = await getAccessKey(accessKey)

    if (accessKey === appAccessKey) {
      const returnedData = await getRegisteredStudents()
      res.status(200).json(returnedData)
    } else {
      res.status(401).json({message: "Unauthorized! App access key is incorrect"})
    }
  })

  .post( async (req, res) => {
    const accessKey = req.headers.authorization
    const appAccessKey = await getAccessKey(accessKey)
    console.log(req.body)
    
    const searchCriteria = req.body.date
    console.log('searchCriteria', searchCriteria)
    
    if (accessKey === appAccessKey) { 
      const returnedData = await getRegisteredStudents(searchCriteria)
      res.status(200).json(returnedData)
    } else {
      res.status(401).json({message: "Unauthorized! App access key is incorrect"})
    }
  })


// endpoint getting the Student Data by Course Name, Career and Registratition Date (form YYYY-MM)
router.route('/get-students-by-course-name-and-career')
  .post( async(req, res) => {
    const accessKey = req.headers.authorization
    const appAccessKey = await getAccessKey(accessKey)

    if (accessKey === appAccessKey) {
      const EMPLOYEE = 'is_career'
      const COMPANY = 'is_business'

      const courseName = req.body.courseName
      const registrationYearMonth = req.body.registrationYearMonth
      const studentCareer = req.body.career

      if (studentCareer === EMPLOYEE) {
        try {
          const dataFromDB = await faunaClient.query(
            Map(
              Paginate(
                Intersection(
                  Match(Index(indexes.GET_STUDENT_COURSE_MODULE1_BY_COURSE_NAME), courseName),
                  Match(Index(indexes.GET_STUDENT_COURSE_MODULE1_BY_CAREER), studentCareer === EMPLOYEE),
                  Match(Index(indexes.GET_STUDENTS_BY_YEAR_MONTH), registrationYearMonth)
                )
              ), Lambda("student", Get(Var("student")))
            )
          )
          let returnedData = dataFromDB.data
          returnedData = returnedData.map(item => item.data)
          res.status(200).json(returnedData)
        } catch (error) {
          res.status(404).json({message: "Data could not be retrieved from Fauna."})
        }
      } else if (studentCareer === COMPANY) {
        try {
          const dataFromDB = await faunaClient.query(
            Map(
              Paginate(
                Intersection(
                  Match(Index(indexes.GET_STUDENT_COURSE_MODULE1_BY_COURSE_NAME), courseName),
                  Match(Index(indexes.GET_STUDENT_COURSE_MODULE1_BY_BUSINESS), studentCareer === COMPANY),
                  Match(Index(indexes.GET_STUDENTS_BY_YEAR_MONTH), registrationYearMonth)
                )
              ), Lambda("student", Get(Var("student")))
            )
          )
          let returnedData = dataFromDB.data
          returnedData = returnedData.map(item => item.data)
          res.status(200).json(returnedData)
        } catch (error) {
          res.status(404).json({message: "Data could not be retrieved from Fauna."})
        }
      }
    } else {
      res.status(401).json({message: "Unauthorized! App access key is incorrect"})
    }
  })

module.exports = router