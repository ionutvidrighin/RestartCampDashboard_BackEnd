const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const dayjs = require('dayjs');
const collections = require('../../FaunaDataBase/collections');
const indexes = require('../../FaunaDataBase/indexes');

const { Documents, Collection, Match, Map, Paginate, Get, Lambda, Index, Var } = faunaDB.query;

async function getCoursePresenceByTitle(title) {
  const getCourseByTitle = await faunaClient.query(
    Map(
      Paginate(Match(Index(indexes.GET_COURSE_PRESENCE_BY_TITLE), title)),
      Lambda(course => Get(course))
    )
  )

  let returnedData = getCourseByTitle.data
  returnedData = returnedData.map(item => item.data)
  returnedData = returnedData.filter(item => {
    return !dayjs(item.course.date).isAfter(dayjs())
  })

  return returnedData
}


router.route('/course-presence')
  .get( async (req, res) => {
    try {
      const data = await getStudentCoursePresence()
      res.status(200).json(data)
    } catch (error) {
      res.status(401).json({message: "There was an error in retrieving the Free Courses from database", error})
    }
  })

  .post( async (req, res) => {
    const courseTitle = req.body.courseTitle
    try {
      const data = await getCoursePresenceByTitle(courseTitle)
      res.status(200).json(data)
    } catch(error) {
      console.log(error)
      res.status(401).json({message: "There was an error in retrieving the course presence data from database", error})
    }
  })

module.exports = router