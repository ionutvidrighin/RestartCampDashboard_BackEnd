const jwt = require('jsonwebtoken');
require('dotenv').config({path: '../../../.env'});
const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const indexes = require("../../FaunaDataBase/indexes");
const collections = require('../../FaunaDataBase/collections');
const { REPLACE_STUDENT_EMAIL_ADDRESS,
  REPLACE_STUDENT_FULL_NAME } = require('../../constants/replaceStudentData');

const { Collection, Get, Paginate, Map, Match, Lambda, Update, Ref, Index } = faunaDB.query

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
  replaceStudentEmailAddress,
  replaceStudentNameAndEmailAddress
}