const express = require("express")
const router = express.Router()
const faunaDB = require("faunadb")
const faunaClient = require("../../faunaDB")
let courses = require('./courses')

const {Map, Create, Delete, Collection, Paginate, Match, Documents, Get, Lambda, Update, Ref, Index, Var} = faunaDB.query

const authToken = 'password'

router.route('/paid-courses')
  .get( async (req, res) => {
    const auth_token = req.headers.authorization

    try {
      const coursesFromDB = await faunaClient.query(
        Map(
          Paginate(Documents(Collection('paidCourses'))),
          Lambda(x => Get(x))
        )
      )
      let paidCourses = coursesFromDB.data
      paidCourses = paidCourses.map(item => item.data)
      paidCourses.sort((a, b) => {
        return new Date(b.courseDate) - new Date(a.courseDate)
      })
      res.status(200).json(paidCourses)
    } catch (error) {
      res.status(401).json({message: "There was an error in retrieving the Paid Courses from database"})
    }
  })

  .post( async (req, res) => {
    const newCourse = req.body
    const auth_token = req.headers.authorization

    try {
      await faunaClient.query(
        Create(
          Collection('paidCourses'),
          { data: newCourse }
        )
      )
      res.status(201).json({message: 'Curs adaugat cu succes!'})
    } catch (error) {
      res.status(401).json({message: 'Invalid Token', error})
    }
  })

  .put( async (req, res) => {
    const courseToModify = req.body
    const auth_token = req.headers.authorization

    const searchCourseByID = await faunaClient.query(
      Map(
        Paginate(Match(Index('get_paid_course_by_id'), courseToModify.courseId)),
        Lambda(x => Get(x))
      )
    )

    if (searchCourseByID.data.length === 0) {
      res.status(404).json({ error: 'Course could not be found in data base'})
      return
    }

    try {
      const dataBaseEntryID = searchCourseByID.data[0].ref.id
      await faunaClient.query(
        Update(
          Ref(Collection('paidCourses'), dataBaseEntryID),
          { data: courseToModify }
        )
      )
      res.status(200).json({message: 'Course has been successfully modified !'})
    } catch (error) {
      res.status(401).json({ message: 'There was an error in modifying the course', error})
    }
  })

  .patch( async (req, res) => {
    const courseToModify = req.body
    const auth_token = req.headers.authorization

    const searchCourseByID = await faunaClient.query(
      Map(
        Paginate(Match(Index('get_paid_course_by_id'), courseToModify.courseId)),
        Lambda(x => Get(x))
      )
    )

    if (searchCourseByID.data.length === 0) {
      res.status(404).json({ error: 'Course could not be found in data base'})
      return
    }

    try {
      const dataBaseEntryID = searchCourseByID.data[0].ref.id;
      await faunaClient.query(
        Update(Ref(Collection("paidCourses"), dataBaseEntryID),
          { data: { courseActive: courseToModify.courseActive } }
        )
      )
      res.status(201).json({
        message: `Course ${courseToModify.courseActive ? "activated" : "deactivated"} with success !`})
    } catch (error) {
      res.status(401).json({message: "There was an error in updating the course state", error})
    }
  })

  .delete( async (req, res) => {
    const courseIdToRemove = req.body.course.courseId
    const auth_token = req.headers.authorization
    
    const searchCourseByID = await faunaClient.query(
      Map(
        Paginate(Match(Index('get_paid_course_by_id'), courseIdToRemove)),
        Lambda(x => Get(x))
      )
    )

    if (searchCourseByID.data.length === 0) {
      res.status(404).json({ error: 'Course could not be found in data base'})
      return
    }

    try {
      const dataBaseEntryID = searchCourseByID.data[0].ref.id
      await faunaClient.query(
        Delete(Ref(Collection('paidCourses'), dataBaseEntryID))
      )
      res.status(200).json({
        message: 'Success! Paid Course has been deleted'
      })
    } catch (error) {
      res.status(401).json({ message: 'There was an error in deleting the paid course', error})
    }
  })


module.exports = router;