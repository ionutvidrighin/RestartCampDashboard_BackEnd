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
    
    const studentEmail = req.body.studentEmail
    const getStudentInCourseModule1 = faunaClient.query(
      Map(
        Paginate(Match(Index(indexes.GET_STUDENT_COURSE_MODULE1_BY_EMAIL), studentEmail)),
        Lambda(student => Get(student))
      )
    )
    const getStudentInCourseModule2 = faunaClient.query(
      Map(
        Paginate(Match(Index(indexes.GET_STUDENT_COURSE_MODULE2_BY_EMAIL), studentEmail)),
        Lambda(student => Get(student))
      )
    )
    const getStudentPresenceInCourseModule1 = faunaClient.query(
      Map(
        Paginate(Match(Index(indexes.GET_STUDENT_COURSE_PRESENCE_MODULE1_BY_EMAIL), studentEmail)),
        Lambda(student => Get(student))
      )
    )

    const promise = [getStudentInCourseModule1, getStudentInCourseModule2, getStudentPresenceInCourseModule1]
    const resolvedPromise = await Promise.all(promise)
    
    //if none of the above indexes could find the Student, return error
    let studentNotFound;
    resolvedPromise.forEach(searchResult => {
      searchResult.data.forEach(set => {
        if (set.length === 0) studentNotFound = true
      })
    })

    if (studentNotFound) {
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
  })

  .put( async (req, res) => {
    const accessKey = req.headers.authorization
    const appAccessKey = await getAccessKey(accessKey)
    const FAKE_EMAIL_ADDRESS = "FAKE_EMAIL_ADDRESS@replaced"
    
    const modificationObject = req.body
    console.log(modificationObject)
    // this is an Array of Object with this form: [ {key: [refID] } ]
    // where the "key" represents the database collection name
    // and the value represents the list of reference IDs (exact location in database) to update

    if (accessKey === appAccessKey) {

      let modifyEmailAddressPromises = []

      modificationObject.forEach(dataSet => {
        if (dataSet.hasOwnProperty(collections.REGISTER_STUDENT_COURSE_MODULE1)) {
          dataSet.registerStudentCourseModule1.forEach( async (refID) => {
            const registerStudentCourseModule1 = faunaClient.query(
              Update(
                Ref(Collection(collections.REGISTER_STUDENT_COURSE_MODULE1), refID),
                { data: { email: FAKE_EMAIL_ADDRESS } }
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
                { data: { email: FAKE_EMAIL_ADDRESS } }
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
                { data: { email: FAKE_EMAIL_ADDRESS } }
              )
            )
            modifyEmailAddressPromises.push(coursesModule1Presence)
          })
        }
      })

      Promise.all(modifyEmailAddressPromises)
        .then(result => {
          res.status(201)
          res.json({message: "Student has been successfully unsubscribed!"})
        })
        .catch(err => {
          console.log(err)
          res.status(500)
          res.json({error: "Student could not be unsubscribed! "})
        })
    } else {
      res.status(401).json({message: "Unauthorized! App access key is incorrect"})
    }
  })

module.exports = router