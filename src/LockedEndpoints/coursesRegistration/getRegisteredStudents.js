const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../../faunaDB");
const storedStudentFullDataJSON = require("../../JSON_Files/storedStudentFullData");

const { Match, Map, Paginate, Get, Collection, Lambda, Index, Var} = faunaDB.query;

router.route('/enrolled-students')
  .get( (req, res) => {
    res.status(200).json(storedStudentFullDataJSON)
  })

router.route('/get-students-by-date')
  .get(async (req, res) => {
   
   /* const searchString = '2021-11'
    const returnedSearchedData = await faunaClient.query(
      Map(
        Paginate(Match(Index("students_registered_by_year_month"), searchString)),
        Lambda("students", Get(Var("students")))
      )
    )

    returnedSearchedData.data.forEach(item => console.log(item.data))
    res.json(getUsersByDate)*/
    res.json({message: 'helllooo'})
  })


module.exports = router