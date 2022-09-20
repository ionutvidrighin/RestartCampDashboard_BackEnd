const jwt = require('jsonwebtoken');
require('dotenv').config({path: '../../../.env'});
const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const collections = require('../../FaunaDataBase/collections');
const indexes = require('../../FaunaDataBase/indexes');

const { Map, Create, Delete, Collection, Paginate, Match, Documents, Get, Lambda, Update, Ref, Index } = faunaDB.query

const getCourses = async (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        try {
          const coursesFromDB = await faunaClient.query(
            Map(
              Paginate(Documents(Collection(collections.COURSES_MODULE_1))),
              Lambda(x => Get(x))
            )
          )
          let coursesModule1 = coursesFromDB.data
          coursesModule1 = coursesModule1.map(item => item.data)
          coursesModule1.sort((a, b) => {
            return new Date(b.courseDate) - new Date(a.courseDate)
          })
          res.status(200).json(coursesModule1)
        } catch (error) {
          res.status(401).json({message: "There was an error in retrieving the Free Courses from database"})
        }
      }
  })
}

const addNewCourse = async (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const newCourse = req.body
        try {
          await faunaClient.query(
            Create(
              Collection(collections.COURSES_MODULE_1),
              { data: newCourse }
            )
          )
          res.status(201).json({message: 'Curs adaugat cu succes!'})
        } catch (error) {
          res.status(401).json({message: 'There was an error in adding a new course', error})
        }
      }
  })
}

const updateCourse = async (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const courseToModify = req.body
        try {
          const searchCourseByID = await faunaClient.query(
            Map(
              Paginate(Match(Index(indexes.GET_COURSE_MODULE1_BY_ID), courseToModify.courseId)),
              Lambda(x => Get(x))
            )
          )

          const docID = searchCourseByID.data[0].ref.id
          await faunaClient.query(
            Update(
              Ref(Collection(collections.COURSES_MODULE_1), docID),
              { data: courseToModify }
            )
          )
          res.status(201).json({message: 'Curs modificat cu succes!'})
        } catch (error) {
          res.status(401).json({ message: 'There was an error in modifying the course', error})
        }
      }
  })
}

const toggleCourseState = async (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const courseToModify = req.body
        try {
          const searchCourseByID = await faunaClient.query(
            Map(
              Paginate(Match(Index(indexes.GET_COURSE_MODULE1_BY_ID), courseToModify.courseId)),
              Lambda(x => Get(x))
            )
          )

          const docID = searchCourseByID.data[0].ref.id;
          await faunaClient.query(
            Update(Ref(Collection(collections.COURSES_MODULE_1), docID),
              { data: { courseActive: courseToModify.courseActive } }
            )
          )
          res.status(201).json({
            message: `Curs ${courseToModify.courseActive ? "activat" : "dezactivat"} cu succes !`})
        } catch (error) {
          res.status(401).json({message: "There was an error in updating course state", error})
        }
      }
  })
}

const deleteCourse = async (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const courseIdToRemove = req.body.courseId
        try {
          const searchCourseByID = await faunaClient.query(
            Map(
              Paginate(Match(Index(indexes.GET_COURSE_MODULE1_BY_ID), courseIdToRemove)),
              Lambda(x => Get(x))
            )
          )

          const docID = searchCourseByID.data[0].ref.id
          await faunaClient.query(
            Delete(Ref(Collection(collections.COURSES_MODULE_1), docID))
          )
          res.status(200).json({ message: 'Succes! Cursul a fost sters.' })
        } catch (error) {
          res.status(401).json({ message: 'There was an error in deleting the course', error})
        }
      }
  })
}

module.exports = {
  getCourses,
  addNewCourse,
  updateCourse,
  toggleCourseState,
  deleteCourse
}