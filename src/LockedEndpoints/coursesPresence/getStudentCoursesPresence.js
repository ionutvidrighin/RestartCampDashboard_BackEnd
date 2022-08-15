const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const dayjs = require('dayjs');
const collections = require('../../FaunaDataBase/collections');
const indexes = require('../../FaunaDataBase/indexes');

const { Documents, Collection, Match, Intersection, Map, Paginate, Get, Lambda, Index, Var } = faunaDB.query;

router.route('/get-course-presence')
  .post( async (req, res) => {
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
  })

module.exports = router