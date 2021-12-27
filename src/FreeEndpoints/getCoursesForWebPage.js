const express = require("express")
const router = express.Router()
const faunaDB = require("faunadb")
const faunaClient = require("../faunaDB")
let freeCourses = require('../LockedEndpoints/freeCourses/courses')
let paidCourses = require('../LockedEndpoints/paidCourses/courses')

const {Map, Collection, Paginate, Documents, Get, Lambda} = faunaDB.query

router.route('/restart-camp-courses')
  .get( async (req, res) => {
    try {
      // query all free courses
      const freeCoursesFromDB = await faunaClient.query(
        Map(
          Paginate(Documents(Collection('freeCourses'))),
          Lambda(x => Get(x))
        )
      )
      let freeCourses = freeCoursesFromDB.data
      freeCourses = freeCourses.map(item => item.data)
      freeCourses.sort((a, b) => {
        return new Date(b.courseDate) - new Date(a.courseDate)
      })

      // query all paid courses
      const paidCoursesFromDB = await faunaClient.query(
        Map(
          Paginate(Documents(Collection('paidCourses'))),
          Lambda(x => Get(x))
        )
      )
      let paidCourses = paidCoursesFromDB.data
      paidCourses = paidCourses.map(item => item.data)
      paidCourses.sort((a, b) => {
        return new Date(b.courseDate) - new Date(a.courseDate)
      })

      res.status(200).json({freeCourses, paidCourses})
    } catch (error) {
      res.status(401).json({message: "There was an error in retrieving the Free Courses from database", error})
    }
  })


module.exports = router;