const jwt = require('jsonwebtoken');
require('dotenv').config({path: '../../../.env'});
const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const indexes = require("../../FaunaDataBase/indexes");

const { Match, Intersection, Map, Paginate, Get, Lambda, Index, Var } = faunaDB.query;

const getStudentPresenceAtCourseModule1 = async (req, res) => {
  jwt.verify(
    req.token, 
    process.env.FAUNA_SECRET, 
    async (err, data) => {
      if (err) {
        console.log(err)
        res.status(403).json({message: "Unauthorized! No Access Token provided."})
      } else {
        const courseName = req.body.courseName
        const registrationYearMonth = req.body.registrationYearMonth
        try {
          const dataFromDB = await faunaClient.query(
            Map(
              Paginate(
                Intersection(
                  Match(Index(indexes.GET_COURSE_PRESENCE_BY_NAME), courseName),
                  Match(Index(indexes.GET_COURSE_PRESENCE_BY_YEAR_MONTH), registrationYearMonth)
                )
              ), Lambda("student", Get(Var("student")))
            )
          )
          let returnedData = dataFromDB.data
          returnedData = returnedData.map(item => item.data)
          res.status(200).json(returnedData)
        } catch(error) {
          console.log(error)
          res.status(401).json({message: "There was an error in retrieving the course presence data from database", error})
        }
      }
  })
}


module.exports = getStudentPresenceAtCourseModule1