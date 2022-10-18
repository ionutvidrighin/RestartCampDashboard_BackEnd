const jwt = require('jsonwebtoken');
require('dotenv').config({path: '../../../.env'});
const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const indexes = require("../../FaunaDataBase/indexes");
const { renameKeysInObject } = require('../../utils/helperMethods');

const { Map, Paginate, Match, Get, Lambda, Index } = faunaDB.query

const getStudentDataByStudentName = async (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const studentName = req.body.studentName
        try {
          // query DB for student (by its name) in DB collections he might be:
          // *registerStudentCourseModule1*, *registerStudentCourseModule2*, *coursesModule1Presence* 
          const promises = []
          const studentInCourseModule1 = faunaClient.query(
            Map(
              Paginate(Match(Index(indexes.GET_STUDENT_IN_COURSES_MODULE1_BY_NAME), studentName)),
              Lambda(student => Get(student))
            )
          )
          const studentInCourseModule2 = faunaClient.query(
            Map(
              Paginate(Match(Index(indexes.GET_STUDENT_IN_COURSES_MODULE2_BY_NAME), studentName)),
              Lambda(student => Get(student))
            )
          )
          const studentPresenceInCourseModule1 = faunaClient.query(
            Map(
              Paginate(Match(Index(indexes.GET_STUDENT_IN_PRESENCE_COURSE_MODULE1_BY_NAME), studentName)),
              Lambda(student => Get(student))
            )
          )
          promises.push(studentInCourseModule1, studentInCourseModule2, studentPresenceInCourseModule1)
      
          const resolvedPromise = await Promise.all(promises)
      
          const noResultsInDB = []
          resolvedPromise.forEach(response => {
            noResultsInDB.push(response.data.length)
          })
      
          // if all promises returned empty data: [], send error to FrontEnd
          if (noResultsInDB[0] === 0 && noResultsInDB[1] === 0 && noResultsInDB[2] === 0) {
            res.status(404).json({ 
              message: `Cursantul cu numele: ${studentName}, nu exista in baza de date.`,
              studentInCoursesModule1: [],
              studentInCoursesModule2: [],
              studentPresenceInCoursesModule1: []
            })
            return
          }
      
          let studentDataInCoursesModule1 = renameKeysInObject(resolvedPromise[0], { data: "studentInCoursesModule1" })
          let studentDataInCoursesModule2 = renameKeysInObject(resolvedPromise[1], { data: "studentInCoursesModule2" })
          let studentDataInPresenceCourseModule1 = renameKeysInObject(resolvedPromise[2], { data: "studentPresenceInCoursesModule1" })
      
          const allStudentData = [studentDataInCoursesModule1, studentDataInCoursesModule2, studentDataInPresenceCourseModule1]
          const studentInCoursesModule1 = []
          const studentInCoursesModule2 = []
          const studentPresenceInCoursesModule1 = []
      
          allStudentData[0].studentInCoursesModule1.forEach(element => {
            studentInCoursesModule1.push({
              ...element.data,
              refId: element.ref.id
            })
          })
          allStudentData[1].studentInCoursesModule2.forEach(element => {
            studentInCoursesModule2.push({
              ...element.data,
              refId: element.ref.id
            })
          })
          allStudentData[2].studentPresenceInCoursesModule1.forEach(element => {
            studentPresenceInCoursesModule1.push({
              ...element.data,
              refId: element.ref.id
            })
          })
      
          res.status(200).json({
            studentInCoursesModule1,
            studentInCoursesModule2,
            studentPresenceInCoursesModule1
          })
          
        } catch (error) {
          res.status(404).json({ 
            error,
            message: "There was an error in retrieving Student Information from data base."
          })
        }
      }
  })
}

const getStudentDataByStudentEmail = async (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const studentEmail = req.body.studentEmail
        try {
          // query DB for student (by its email address) in the collections where he might be:
          // *registerStudentCourseModule1*, *registerStudentCourseModule2*, *coursesModule1Presence* 
          const promises = []
          const studentInCourseModule1 = faunaClient.query(
            Map(
              Paginate(Match(Index(indexes.GET_STUDENT_IN_COURSES_MODULE1_BY_EMAIL), studentEmail)),
              Lambda(student => Get(student))
            )
          )
          const studentInCourseModule2 = faunaClient.query(
            Map(
              Paginate(Match(Index(indexes.GET_STUDENT_IN_COURSES_MODULE2_BY_EMAIL), studentEmail)),
              Lambda(student => Get(student))
            )
          )
          const studentPresenceInCourseModule1 = faunaClient.query(
            Map(
              Paginate(Match(Index(indexes.GET_STUDENT_IN_PRESENCE_COURSE_MODULE1_BY_EMAIL), studentEmail)),
              Lambda(student => Get(student))
            )
          )
          promises.push(studentInCourseModule1, studentInCourseModule2, studentPresenceInCourseModule1)
      
          const resolvedPromise = await Promise.all(promises)
      
          const noResultsInDB = []
          resolvedPromise.forEach(response => {
            noResultsInDB.push(response.data.length)
          })
      
          // if all promises returned empty data: [], send error to FrontEnd
          if (noResultsInDB[0] === 0 && noResultsInDB[1] === 0 && noResultsInDB[2] === 0) {
            res.status(404).json({ 
              message: `Cursantul cu adresa e-mail: ${studentEmail}, nu exista in baza de date.`,
              studentInCoursesModule1: [],
              studentInCoursesModule2: [],
              studentPresenceInCoursesModule1: []
            })
            return
          }
      
          let studentDataInCoursesModule1 = renameKeysInObject(resolvedPromise[0], { data: "studentInCoursesModule1" })
          let studentDataInCoursesModule2 = renameKeysInObject(resolvedPromise[1], { data: "studentInCoursesModule2" })
          let studentDataInPresenceCourseModule1 = renameKeysInObject(resolvedPromise[2], { data: "studentPresenceInCoursesModule1" })
      
          const allStudentData = [studentDataInCoursesModule1, studentDataInCoursesModule2, studentDataInPresenceCourseModule1]
          const studentInCoursesModule1 = []
          const studentInCoursesModule2 = []
          const studentPresenceInCoursesModule1 = []
      
          allStudentData[0].studentInCoursesModule1.forEach(element => {
            studentInCoursesModule1.push({
              ...element.data,
              refId: element.ref.id
            })
          })
          allStudentData[1].studentInCoursesModule2.forEach(element => {
            studentInCoursesModule2.push({
              ...element.data,
              refId: element.ref.id
            })
          })
          allStudentData[2].studentPresenceInCoursesModule1.forEach(element => {
            studentPresenceInCoursesModule1.push({
              ...element.data,
              refId: element.ref.id
            })
          })
      
          res.status(200).json({
            studentInCoursesModule1,
            studentInCoursesModule2,
            studentPresenceInCoursesModule1
          })
          
        } catch (error) {
          res.status(404).json({ 
            error,
            message: "There was an error in retrieving Student Information from data base."
          })
        }
      }
  })
}

module.exports = {
  getStudentDataByStudentName,
  getStudentDataByStudentEmail
}