const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const dayjs = require('dayjs');
const storedStudentPresenceJSON = require("../../JSON_Files/storedStudentPresence");

const { Documents, Collection, Match, Map, Paginate, Get, Lambda, Index, Var} = faunaDB.query;

async function getStudentCoursePresence() {
  const currentYearAndMonth = `${dayjs().year()}-${dayjs().month()+1}`

  // get all available courses from DB at first
  // so that we can query the first one in the list, later
  const allAvailableFreeCoursesFromDB = await faunaClient.query(
    Map(
      Paginate(Documents(Collection('freeCourses'))),
      Lambda(x => Get(x))
    )
  )

  let freeCourses = allAvailableFreeCoursesFromDB.data
  freeCourses = freeCourses.map(item => item.data.courseTitle)
  
  // query DB and get the data of the first course in *freeCourses* list
  // this will get data from *storedStudentLimitedData* collection
  const searchCourseInDB = await faunaClient.query(
    Map(
      Paginate(Match(Index('get_course_presence_by_name'), freeCourses[0])),
      Lambda(x => Get(x))
    )
  )
  let formatedData = []
  searchCourseInDB.data.forEach(course => formatedData.push(course.data))
  // filter out all entries which are not for current month
  const returnedData = formatedData.filter(courseDate => courseDate.year_month === currentYearAndMonth)
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

module.exports = router