const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const collections = require('../../FaunaDataBase/collections');
const indexes = require('../../FaunaDataBase/indexes');
const dayjs = require('dayjs');
const localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat)

const { Map, Collection, Paginate, Match, Get, Lambda, Update, Ref, Index, Var } = faunaDB.query

// function taking care of pulling Course & Student data from DB, to display it on UI 
// to further proceed with the presence confirm at a given course
const getCourseForPresenceConfirmByCourseId = async (request, response) => {
  const courseIdRequest = request.body.courseId

  try {
    const searchedStudent = await faunaClient.query(
      Map(
        Paginate(Match(Index(indexes.GET_COURSE_FOR_PRESENCE_CONFIRM_BY_COURSE_ID), courseIdRequest)),
        Lambda("student", Get(Var("student")))
      )
    )
    const courseIdInDB = searchedStudent.data[0].data.id

    if (courseIdInDB === courseIdRequest) {
      response.status(200).json(searchedStudent.data[0].data)
    } else {
      response.status(401).json({
        message: "Eroare! Link invalid. Te rugam sa te intorci la e-mailul primit de la noi si sa dai click direct pe linkul de acces la aceasta sesiune!",
      })
    }
  } catch (error) {
    console.log(error)
    response.status(404).json({
      message: "Eroare! Link invalid. Te rugam sa te intorci la e-mailul primit de la noi si sa dai click direct pe linkul de acces la aceasta sesiune!",
      error
    })
  }
}

// function taking care of confirming student's presence at a given course
const confirmStudentPresenceAtCourse = async (req, res) => {
  const courseId = req.body.courseId

  try {
    const courseData = await faunaClient.query(
      Map(
        Paginate(Match(Index(indexes.GET_COURSE_FOR_PRESENCE_CONFIRM_BY_COURSE_ID), courseId)),
        Lambda('course', Get(Var('course')))
      )
    )

    if (courseData.data.length == 0) {
      res.status(404).json({message: `☹️ Din păcate nu găsim sesiunea cu codul de confirmare: ${courseId}. Te rugăm să verifici corectitudinea codului primit pe e-mail.`})
    } else {
      const courseName = courseData.data[0].data.courseName.title
  
      const docID = courseData.data[0].ref.id
      await faunaClient.query(
        Update(
          Ref(Collection(collections.COURSES_MODULE_1_PRESENCE), docID),
          { data: { courseName: { present: true } } }
        )
      )
      res.status(201).json({message: `Felicitări! Accesul tău este confirmat la sesiunea - ${courseName}`})
    }
  } catch (error) {
    console.log(error)
    res.status(404).json({message: "☹️ A apărut o eroare. Te rugăm să iei legătura cu noi cât mai repede pentru a ne ajuta să o rezolvăm.", error})
  }
}

module.exports = { 
  getCourseForPresenceConfirmByCourseId,
  confirmStudentPresenceAtCourse
}