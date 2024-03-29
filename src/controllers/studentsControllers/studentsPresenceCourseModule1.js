const jwt = require('jsonwebtoken');
require('dotenv').config({path: '../../../.env'});
const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const indexes = require("../../FaunaDataBase/indexes");
const helperMethods = require('../../utils/helperMethods');

const { Match, Intersection, Map, Paginate, Get, Lambda, Index, Var } = faunaDB.query;
 
const getStudentPresenceAtCourseModule1 = async (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const courseName = req.body.courseName
        const searchingDate = req.body.registrationYearMonth
        const userTablePermissions = req.body.userTablePermissions

        try {
          const restrictedColumns = []
          userTablePermissions.forEach(column => column.selected && restrictedColumns.push(column.value))

          const dataFromDB = await faunaClient.query(
            Map(
              Paginate(
                Intersection(
                  Match(Index(indexes.GET_COURSE_PRESENCE_BY_NAME), courseName),
                  Match(Index(indexes.GET_COURSE_PRESENCE_BY_YEAR_MONTH), searchingDate)
                )
              ), Lambda("student", Get(Var("student")))
            )
          )
          let returnedData = dataFromDB.data
          returnedData = returnedData.map(item => item.data)

          const returnedDataAccordingToPermissions = []
          returnedData.forEach(entry => {
            restrictedColumns.forEach(column => {
              if (entry.hasOwnProperty(column)) {
                delete entry[column]
              }
              if (column === 'courseName') {
                delete entry.course['title']
              }
              if (column === 'present') {
                delete entry.course['present']
              }
            })
            returnedDataAccordingToPermissions.push(entry)
          })

          res.status(200).json(returnedDataAccordingToPermissions)
        } catch(error) {
          console.log(error)
          res.status(401).json({message: "There was an error in retrieving the course presence data from database", error})
        }
      }
  })
}

const getStudentsWhatsappNumbers = async(req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const courseName = req.body.courseName
        const searchingDate = req.body.registrationYearMonth

        try {
          const DBdata = await faunaClient.query(
            Map(
              Paginate(
                Intersection(
                  Match(Index(indexes.GET_COURSE_PRESENCE_BY_NAME), courseName),
                  Match(Index(indexes.GET_COURSE_PRESENCE_BY_YEAR_MONTH), searchingDate)
                )
              ), Lambda("students", Get(Var("students")))
            )
          )

          let returnedData = DBdata.data
          returnedData = returnedData.map(item => item.data)
          returnedData = helperMethods.preparePhoneNumbersWhatsappFormat(returnedData)

          res.status(200).json(returnedData)
        } catch (error) {
          console.log(error)
          res.status(401).json({message: "There was an error in retrieving the registered Students Courses Module 1 from database"})
        }
      }
  })
}


module.exports = { getStudentPresenceAtCourseModule1, getStudentsWhatsappNumbers }