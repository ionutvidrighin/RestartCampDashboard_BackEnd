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
        message: "Date invalide, te rugam sa te asiguri ca adresa de e-mail este cea folosita in momentul inregistrarii la curs," +
                 " iar ID-ul de curs este cel primit in e-mail-ul de confirmare."
      })
    }
  } catch (error) {
    console.log(error)
    response.status(404).json({
      message: "Student and Course data for Presence Confirm could not be retrieved from data base",
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
      res.status(404).json({message: `☹️ Din păcate nu găsim cursul cu ID: ${courseId}. Te rugăm să verifici corectitudinea ID-ului.`})
    } else {
      const courseName = courseData.data[0].data.courseName.title
  
      const docID = courseData.data[0].ref.id
      await faunaClient.query(
        Update(
          Ref(Collection(collections.COURSES_MODULE_1_PRESENCE), docID),
          { data: { course: { present: true } } }
        )
      )
      res.status(201).json({message: `Prezență confirmată la cursul ${courseName}`})
    }
  } catch (error) {
    console.log(error)
    res.status(404).json({message: "☹️ A apărut o eroare. Te rugăm să iei legătura cu noi cât mai repede.", error})
  }
}

module.exports = { 
  getCourseForPresenceConfirmByCourseId,
  confirmStudentPresenceAtCourse
}