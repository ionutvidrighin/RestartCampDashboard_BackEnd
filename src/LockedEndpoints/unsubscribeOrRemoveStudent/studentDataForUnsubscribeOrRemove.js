const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const indexes = require("../../FaunaDataBase/indexes");
const collections = require('../../FaunaDataBase/collections');
const dayjs = require('dayjs');
const getAccessKey = require("../../Authentication/getAccessKey");

const { Map, Create, Delete, Collection, Paginate, Match, Documents, Get, Lambda, Update, Ref, Index, Var } = faunaDB.query

function renameKeysInObject(obj, newKeys) {
  const keyValues = Object.keys(obj).map(key => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  })
  return Object.assign({}, ...keyValues);
}

router.route('/unsubscribe-remove-student')
  .post( async (req, res) => {
    const accessKey = req.headers.authorization
    const appAccessKey = await getAccessKey(accessKey)
    
    const promise = []
    if (req.body.hasOwnProperty("studentEmail")) {
      const studentEmail = req.body.studentEmail

      const getStudentInCourseModule1 = faunaClient.query(
        Map(
          Paginate(Match(Index(indexes.GET_STUDENT_COURSE_MODULE1_BY_EMAIL), studentEmail)),
          Lambda(student => Get(student))
        )
      )
      promise.push(getStudentInCourseModule1)
      const getStudentInCourseModule2 = faunaClient.query(
        Map(
          Paginate(Match(Index(indexes.GET_STUDENT_COURSE_MODULE2_BY_EMAIL), studentEmail)),
          Lambda(student => Get(student))
        )
      )
      promise.push(getStudentInCourseModule2)
      const getStudentPresenceInCourseModule1 = faunaClient.query(
        Map(
          Paginate(Match(Index(indexes.GET_STUDENT_COURSE_PRESENCE_MODULE1_BY_EMAIL), studentEmail)),
          Lambda(student => Get(student))
        )
      )
      promise.push(getStudentPresenceInCourseModule1)
    } else if (req.body.hasOwnProperty("studentName")) {
      const studentName = req.body.studentName

      const getStudentInCourseModule1 = faunaClient.query(
        Map(
          Paginate(Match(Index(indexes.GET_STUDENT_COURSE_MODULE1_BY_NAME), studentName)),
          Lambda(student => Get(student))
        )
      )

      const getStudentInCourseModule2 = faunaClient.query(
        Map(
          Paginate(Match(Index(indexes.GET_STUDENT_COURSE_MODULE2_BY_NAME), studentName)),
          Lambda(student => Get(student))
        )
      )

      const getStudentPresenceInCourseModule1 = faunaClient.query(
        Map(
          Paginate(Match(Index(indexes.GET_STUDENT_COURSE_PRESENCE_MODULE1_BY_NAME), studentName)),
          Lambda(student => Get(student))
        )
      )
    
      promise.push(getStudentInCourseModule1, getStudentInCourseModule2, getStudentPresenceInCourseModule1)
    }

    try {
      const resolvedPromise = await Promise.all(promise)
  
      const noResultsInDB = []
      resolvedPromise.forEach(searchResult => {
        noResultsInDB.push(searchResult.data.length)
      })
      
      // if all promises returned empty data: [], send error to FrontEnd
      if (noResultsInDB[0] === 0 && noResultsInDB[1] === 0 && noResultsInDB[2] === 0) {
        res.status(404).json({ 
          error: 'Student could not be found in data base',
          studentInCoursesModule1: [],
          studentInCoursesModule2: [],
          studentPresenceInCoursesModule1: []
        })
        return
      }

      if (accessKey === appAccessKey) {
        const renameKeyStudentCourseMod1 = { data: "studentInCoursesModule1" }
        let dataInCoursesModule1 = renameKeysInObject(resolvedPromise[0], renameKeyStudentCourseMod1)
  
        const renameKeyStudentCourseMod2 = { data: "studentInCoursesModule2" }
        let dataInCoursesModule2 = renameKeysInObject(resolvedPromise[1], renameKeyStudentCourseMod2)
    
        const renameKeyStudentPresence = { data: "studentPresenceInCoursesModule1" }
        let dataInPresenceCourseModule1 = renameKeysInObject(resolvedPromise[2], renameKeyStudentPresence)
  
        const allStudentData = [dataInCoursesModule1, dataInCoursesModule2, dataInPresenceCourseModule1]
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
      } else {
        res.status(401).json({message: "Unauthorized! App access key is incorrect"})
      }

    } catch (err) {
      console.log(err)
      res.status(404).json({ 
        error: err,
        message: "There was an error"
      })
    }
  })

  .put( async (req, res) => {
    const accessKey = req.headers.authorization
    const appAccessKey = await getAccessKey(accessKey)
    const REPLACE_STUDENT_EMAIL_ADDRESS = "FAKE_EMAIL_ADDRESS@replaced.r"
    const REPLACE_STUDENT_FULL_NAME = "*Student Name Replaced*"
    const UNSUBSCRIBE_STUDENT_KEY = "unsubscribeStudent"
    const DELETE_STUDENT_KEY = "deleteStudentData"
    
    const modificationObject = req.body
    // this is an Array of Object with this form: [ {key: [refID] } ]
    // where the "key" represents the database collection name
    // and the value represents the list of reference IDs (exact location in database) to update

    if (accessKey === appAccessKey) {

      let modifyEmailAddressPromises = []
      let modifyStudentDataName = []

      if (modificationObject[0] === UNSUBSCRIBE_STUDENT_KEY) {
        modificationObject.forEach(dataSet => {
          if (dataSet.hasOwnProperty(collections.REGISTER_STUDENT_COURSE_MODULE1)) {
            dataSet.registerStudentCourseModule1.forEach( async (refID) => {
              const registerStudentCourseModule1 = faunaClient.query(
                Update(
                  Ref(Collection(collections.REGISTER_STUDENT_COURSE_MODULE1), refID),
                  { data: { email: REPLACE_STUDENT_EMAIL_ADDRESS } }
                )
              )
              modifyEmailAddressPromises.push(registerStudentCourseModule1)
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
              modifyEmailAddressPromises.push(registerStudentCourseModule2)
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
              modifyEmailAddressPromises.push(coursesModule1Presence)
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
    
      } else if (modificationObject[0] === DELETE_STUDENT_KEY) {
        modificationObject.forEach(dataSet => {
          if (dataSet.hasOwnProperty(collections.REGISTER_STUDENT_COURSE_MODULE1)) {
            dataSet.registerStudentCourseModule1.forEach( async (refID) => {
              const registerStudentCourseModule1 = faunaClient.query(
                Update(
                  Ref(Collection(collections.REGISTER_STUDENT_COURSE_MODULE1), refID),
                  { data: { fullName: REPLACE_STUDENT_FULL_NAME, email: REPLACE_STUDENT_EMAIL_ADDRESS } }
                )
              )
              modifyStudentDataName.push(registerStudentCourseModule1)
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
              modifyStudentDataName.push(registerStudentCourseModule2)
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
              modifyStudentDataName.push(coursesModule1Presence)
            })
          }
        })

        try {
          await Promise.all(modifyStudentDataName)
          res.json({
            message: `Student name has been successfully replaced to ${REPLACE_STUDENT_FULL_NAME} and Student e-mail address has been replaced to ${REPLACE_STUDENT_EMAIL_ADDRESS}!`
          })
        } catch (err) {
          console.log(err)
          res.status(500)
          res.json({error: "Student name could not be replaced! "})
        }
      }

    } else {
      res.status(401).json({message: "Unauthorized! App access key is incorrect"})
    }
  })

module.exports = router