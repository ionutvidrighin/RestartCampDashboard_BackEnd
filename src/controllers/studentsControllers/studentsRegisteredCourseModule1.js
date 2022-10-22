const jwt = require('jsonwebtoken');
require('dotenv').config({path: '../../../.env'});
const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const indexes = require("../../FaunaDataBase/indexes");
const collections = require("../../FaunaDataBase/collections");

const { Documents, Collection, Map, Intersection, Paginate, Match, Get, Lambda, Index, Var } = faunaDB.query

const getAllStudentsData = async (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        try {
          const DBdata = await faunaClient.query(
            Map(
              Paginate(Documents(Collection(collections.REGISTER_STUDENT_COURSE_MODULE1))),
              Lambda(x => Get(x))
            )
          )

          let allStudentsData = DBdata.data
          allStudentsData = allStudentsData.map(item => {
            const student = item.data
            const courseName = item.data.courseName[0].title
            student.courseName = courseName
            return student
          })
          res.status(200).json(allStudentsData)
        } catch (error) {
          console.log(error)
          res.status(401).json({message: "There was an error in retrieving the Free Courses from database"})
        }
      }
  })
}

const getStudentsByYearMonth = async (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const searchingDate = req.body.date
        const userTablePermissions = req.body.userTablePermissions

        try {
          const restrictedColumns = []
          userTablePermissions.forEach(column => column.selected && restrictedColumns.push(column.value))

          const DBdata = await faunaClient.query(
            Map(
              Paginate(Match(Index(indexes.GET_STUDENTS_BY_YEAR_MONTH), searchingDate)),
              Lambda("students", Get(Var("students")))
            )
          )
          let returnedData = DBdata.data
          returnedData = returnedData.map(item => item.data)

          const returnedDataAccordingToPermissions = []
          returnedData.forEach(entry => {
            restrictedColumns.forEach(column => {
              if (entry.hasOwnProperty(column)) {
                delete entry[column]
              }
            })
            returnedDataAccordingToPermissions.push(entry)
          })

          res.status(200).json(returnedDataAccordingToPermissions)
        } catch (error) {
          console.log(error)
          res.status(401).json({message: "There was an error in retrieving the registered Students Courses Module 1 from database"})
        }
      }
  })
}

const getStudentsByCourseNameAndCareer = async(req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const courseName = req.body.courseName
        const registrationYearMonth = req.body.registrationYearMonth
        const studentCareer = req.body.career
        const userTablePermissions = req.body.userTablePermissions

        try {
          const restrictedColumns = []
          userTablePermissions.forEach(column => column.selected && restrictedColumns.push(column.value))

          const dataFromDB = await faunaClient.query(
            Map(
              Paginate(
                Intersection(
                  Match(Index(indexes.GET_STUDENTS_IN_COURSES_MODULE1_BY_COURSE_NAME), courseName),
                  Match(Index(indexes.GET_STUDENTS_IN_COURSES_MODULE1_BY_CAREER), studentCareer),
                  Match(Index(indexes.GET_STUDENTS_BY_YEAR_MONTH), registrationYearMonth)
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
            })
            returnedDataAccordingToPermissions.push(entry)
          })

          res.status(200).json(returnedDataAccordingToPermissions)
        } catch (error) {
          console.log(error)
          res.status(404).json({message: "Students Data (by CourseName, Career and Date) could not be retrieved from data base.", error})
        }
      }
  })
}

const getStudentsWithoutUnsubscribedAndDeleted = (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const searchingDate = req.body.date
        try {
          const DBdata = await faunaClient.query(
            Map(
              Paginate(Match(Index(indexes.GET_STUDENTS_BY_YEAR_MONTH), searchingDate)),
              Lambda("students", Get(Var("students")))
            )
          )
          let returnedData = DBdata.data
          returnedData = returnedData.map(item => item.data)
          returnedData = returnedData.filter(student => student.subscribedToEmails && student.activeStudent)
          res.status(200).json(returnedData)
        } catch (error) {
          res.status(401).json({message: "There was an error in retrieving the registered Students Courses Module 1 from database"})
        }
      }
  })
}


module.exports = {
  getAllStudentsData,
  getStudentsByYearMonth,
  getStudentsByCourseNameAndCareer,
  getStudentsWithoutUnsubscribedAndDeleted
}