const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const indexes = require("../../FaunaDataBase/indexes");
const getAccessKey = require("../../Authentication/getAccessKey");

const { Map, Intersection, Paginate, Match, Get, Lambda, Index, Var } = faunaDB.query

const getStudentsByYearMonth = async (req, res) => {
  const accessKey = req.headers.authorization
  const appAccessKey = await getAccessKey(accessKey)
  const searchingDate = req.body.date

  if (accessKey === appAccessKey) {
    try {
      const DBdata = await faunaClient.query(
        Map(
          Paginate(Match(Index(indexes.GET_STUDENTS_BY_YEAR_MONTH), searchingDate)),
          Lambda("students", Get(Var("students")))
        )
      )
      let returnedData = DBdata.data
      returnedData = returnedData.map(item => item.data)
    
      res.status(200).json(returnedData)
    } catch (error) {
      res.status(401).json({message: "There was an error in retrieving the registered Students Courses Module 1 from database"})
    }
  } else {
    res.status(401).json({message: "Unauthorized! App access key is incorrect"})
  }
}

const getStudentsByCourseNameAndCareer = async(req, res) => {
  const accessKey = req.headers.authorization
  const appAccessKey = await getAccessKey(accessKey)

  if (accessKey === appAccessKey) {
    const courseName = req.body.courseName
    const registrationYearMonth = req.body.registrationYearMonth
    const studentCareer = req.body.career

    try {
      const dataFromDB = await faunaClient.query(
        Map(
          Paginate(
            Intersection(
              Match(Index(indexes.GET_STUDENTS_IN_COURSES_MODULE1_BY_COURSE_NAME), courseName),
              Match(Index(indexes.GET_STUDENTS_IN_COURSES_MODULE1_BY_CAREER), studentCareer),
              Match(Index(indexes.GET_STUDENTS_BY_YEAR_MONTH), registrationYearMonth)
            )
          ), Lambda("student", Get(Var("student")))
        )
      )
      let returnedData = dataFromDB.data
      returnedData = returnedData.map(item => item.data)

      res.status(200).json(returnedData)
    } catch (error) {
      console.log(error)
      res.status(404).json({message: "Students Data (by CourseName, Career and Date) could not be retrieved from data base.", error})
    }
  } else {
    res.status(401).json({message: "Unauthorized! App access key is incorrect"})
  }
}


module.exports = {
  getStudentsByYearMonth,
  getStudentsByCourseNameAndCareer
}