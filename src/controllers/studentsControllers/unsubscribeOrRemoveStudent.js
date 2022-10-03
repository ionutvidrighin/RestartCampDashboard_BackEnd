const jwt = require('jsonwebtoken');
require('dotenv').config({path: '../../../.env'});
const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const indexes = require("../../FaunaDataBase/indexes");
const collections = require('../../FaunaDataBase/collections');
const { REPLACE_STUDENT_EMAIL_ADDRESS,
  REPLACE_STUDENT_FULL_NAME } = require('../../constants/replaceStudentData');

const { Map, Collection, Paginate, Match, Get, Lambda, Update, Ref, Index } = faunaDB.query

function renameKeysInObject(object, newKeys) {
  const keyValues = Object.keys(object).map(key => {
    const newKey = newKeys[key] || key
    return { [newKey]: object[key] }
  })
  return Object.assign({}, ...keyValues)
}

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
              error: `Cursantul cu numele: ${studentName}, nu exista in baza de date.`,
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

const replaceStudentEmailAddress = async (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const modificationObject = req.body
        /**
         * "modificationObject" is an Array of Objects, with form: 
         * [ {key: [refID, refID, refID]}, {key: [refID, refID, refID]}, {key: [refID, refID, refID]} ] 
         *      - where key represents FaunaDB Collection Name
         *      - and value is a list (array) of numbers, representing the document IDs 
         *        in which we need to replace Student Email Address
         * 
         * currently the "modificationObject" has following form:
         * [
         *  { registerStudentCourseModule1: [refId, refId, refId] },
         *  { registerStudentCourseModule2: [refId, refId, refId] },
         *  { coursesModule1Presence: [refId, refId, refId] }
         * ]
         * 
        **/

        const promises = []
      
        modificationObject.forEach(dataSet => {
          // go through each element in the modificationObject and check if it contains FaunaDB collection name
          // if it does, go through each of its values (refIDs) and call the Update document based for that refID 
          if (dataSet.hasOwnProperty(collections.REGISTER_STUDENT_COURSE_MODULE1)) {
            dataSet.registerStudentCourseModule1.forEach( async (refID) => {
              const registerStudentCourseModule1 = faunaClient.query(
                Update(
                  Ref(Collection(collections.REGISTER_STUDENT_COURSE_MODULE1), refID),
                  { data: { email: REPLACE_STUDENT_EMAIL_ADDRESS } }
                )
              )
              promises.push(registerStudentCourseModule1)
            })
          }
      
          if (dataSet.hasOwnProperty(collections.REGISTER_STUDENT_COURSE_MODULE2)) {
            dataSet.registerStudentCourseModule2.forEach( async (refID) => {
              const registerStudentCourseModule2 = faunaClient.query(
                Update(
                  Ref(Collection(collections.REGISTER_STUDENT_COURSE_MODULE2), refID),
                  { data: { email: REPLACE_STUDENT_EMAIL_ADDRESS } }
                )
              )
              promises.push(registerStudentCourseModule2)
            })
          }
      
          if (dataSet.hasOwnProperty(collections.COURSES_MODULE_1_PRESENCE)) {
            dataSet.coursesModule1Presence.forEach( async (refID) => {
              const coursesModule1Presence = faunaClient.query(
                Update(
                  Ref(Collection(collections.COURSES_MODULE_1_PRESENCE), refID),
                  { data: { email: REPLACE_STUDENT_EMAIL_ADDRESS } }
                )
              )
              promises.push(coursesModule1Presence)
            })
          }
        })
  
        try {
          await Promise.all(modifyEmailAddressPromises)
          res.json({message: `Student e-mail address has been successfully replaced to ${REPLACE_STUDENT_EMAIL_ADDRESS}!`})
        } catch (err) {
          console.log(err)
          res.status(500)
          res.json({error: "Student could not be unsubscribed! "})
        }
      }
  })
}

const replaceStudentNameAndEmailAddress = async (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const modificationObject = req.body
        /**
         * "modificationObject" is an Array of Objects, with form: 
         * [ {key: [refID, refID, refID]}, {key: [refID, refID, refID]}, {key: [refID, refID, refID]} ] 
         *      - where key represents FaunaDB Collection Name
         *      - and value is a list (array) of numbers, representing the document IDs 
         *        in which we need to replace Student Email Address
         * 
         * currently the "modificationObject" has following form:
         * [
         *  { registerStudentCourseModule1: [refId, refId, refId] },
         *  { registerStudentCourseModule2: [refId, refId, refId] },
         *  { coursesModule1Presence: [refId, refId, refId] }
         * ]
         * 
        **/

        const promises = []
      
        // go through each element in the modificationObject and check if it contains FaunaDB collection name
        // and if it does, go through each of its values (refIDs) and call the Update document with that refID 
        modificationObject.forEach(dataSet => {
          if (dataSet.hasOwnProperty(collections.REGISTER_STUDENT_COURSE_MODULE1)) {
            dataSet.registerStudentCourseModule1.forEach( async (refID) => {
              const registerStudentCourseModule1 = faunaClient.query(
                Update(
                  Ref(Collection(collections.REGISTER_STUDENT_COURSE_MODULE1), refID),
                  { data: { fullName: REPLACE_STUDENT_FULL_NAME, email: REPLACE_STUDENT_EMAIL_ADDRESS } }
                )
              )
              promises.push(registerStudentCourseModule1)
            })
          }
      
          if (dataSet.hasOwnProperty(collections.REGISTER_STUDENT_COURSE_MODULE2)) {
            dataSet.registerStudentCourseModule2.forEach( async (refID) => {
              const registerStudentCourseModule2 = faunaClient.query(
                Update(
                  Ref(Collection(collections.REGISTER_STUDENT_COURSE_MODULE2), refID),
                  { data: { fullName: REPLACE_STUDENT_FULL_NAME, email: REPLACE_STUDENT_EMAIL_ADDRESS } }
                )
              )
              promises.push(registerStudentCourseModule2)
            })
          }
      
          if (dataSet.hasOwnProperty(collections.COURSES_MODULE_1_PRESENCE)) {
            dataSet.coursesModule1Presence.forEach( async (refID) => {
              const coursesModule1Presence = faunaClient.query(
                Update(
                  Ref(Collection(collections.COURSES_MODULE_1_PRESENCE), refID),
                  { data: { fullName: REPLACE_STUDENT_FULL_NAME, email: REPLACE_STUDENT_EMAIL_ADDRESS } }
                )
              )
              promises.push(coursesModule1Presence)
            })
          }
        })
        
        try {
          await Promise.all(promises)
          res.json({
            message: `Student name has been successfully replaced to ${REPLACE_STUDENT_FULL_NAME} and Student e-mail address has been replaced to ${REPLACE_STUDENT_EMAIL_ADDRESS}!`
          })
        } catch (err) {
          console.log(err)
          res.status(500)
          res.json({error: "Student data could not be replaced! "})
        }
      }
  })
}

module.exports = {
  getStudentDataByStudentName,
  getStudentDataByStudentEmail,
  replaceStudentEmailAddress,
  replaceStudentNameAndEmailAddress
}