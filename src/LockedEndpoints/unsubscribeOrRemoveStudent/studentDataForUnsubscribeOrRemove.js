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
    if (resolvedPromise.length === 0) {
      res.status(404).json({ message: 'Student could not be found in data base'})
      return
    }

    if (accessKey === appAccessKey) {
      const renameKeyStudentCourseMod1 = { data: "courseModule1" };
      let studentInCourseModule1 = renameKeysInObject(resolvedPromise[0], renameKeyStudentCourseMod1);
      studentInCourseModule1 = studentInCourseModule1.courseModule1.map(item => item.data)

      const renameKeyStudentCourseMod2 = { data: "courseModule2" };
      let studentInCourseModule2 = renameKeysInObject(resolvedPromise[1], renameKeyStudentCourseMod2);
      studentInCourseModule2 = studentInCourseModule2.courseModule2.map(item => item.data)
  
      const renameKeyStudentPresence = { data: "presenceCourseModule1" };
      let studentPresenceInCourseModule1 = renameKeysInObject(resolvedPromise[2], renameKeyStudentPresence);
      studentPresenceInCourseModule1 = studentPresenceInCourseModule1.presenceCourseModule1.map(item => item.data)

      res.status(200).json({
        studentInCourseModule1,
        studentInCourseModule2,
        studentPresenceInCourseModule1
      })

    } else {
      res.status(401).json({message: "Unauthorized! App access key is incorrect"})
    }
  })

  .put(() => {

  })

module.exports = router