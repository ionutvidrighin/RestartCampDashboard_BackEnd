const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const dayjs = require('dayjs');
const getAccessKey = require("../../Authentication/getAccessKey");
const storedStudentFullDataJSON = require("../../JSON_Files/storedStudentFullData");

const { Map, Create, Delete, Collection, Paginate, Match, Documents, Get, Lambda, Update, Ref, Index, Var } = faunaDB.query
const currentYear = dayjs().year()
const currentMonth = dayjs().month() + 1 // Months count, starts from 0 with dayjs library

const getRegisteredStudents = async (date) => {
  const currentYearAndMonth = `${currentYear}-${currentMonth < 10 ? '0'+currentMonth : currentMonth}`

  try {
    const dataFromDB = await faunaClient.query(
      Map(
        Paginate(Match(Index("students_registered_by_year_month"), date === undefined ? currentYearAndMonth : date)),
        Lambda("students", Get(Var("students")))
      )
    )
    returnedData = dataFromDB.data
    console.log(returnedData)
    returnedData = returnedData.map(item => item.data)
    return returnedData
  } catch (error) {
    return error
  }
}

router.route('/get-enrolled-students')
  .get(async (req, res) => {
    const accessKey = req.headers.authorization
    const appAccessKey = await getAccessKey(accessKey)

    if (accessKey === appAccessKey) {
      const returnedData = await getRegisteredStudents()
      res.status(200).json(returnedData)
    } else {
      res.status(401).json({message: "Unauthorized! App access key is incorrect"})
    }
  })

  .post( async (req, res) => {
    const accessKey = req.headers.authorization
    const appAccessKey = await getAccessKey(accessKey)
    
    const searchCriteria = req.body.date
    console.log(searchCriteria)
    
    if (accessKey === appAccessKey) {
      const returnedData = await getRegisteredStudents(searchCriteria)
      res.status(200).json(returnedData)
    } else {
      res.status(401).json({message: "Unauthorized! App access key is incorrect"})
    }
  })

module.exports = router