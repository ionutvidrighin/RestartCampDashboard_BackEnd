// Two enpoints on this file:
// 1. endpoint that checks student data before proceeding with the presence confirmation to a particular course
///// if student is found in DB, it sends the data to Front End
// 2. endpoint that grabs the database entry ID from Front End and updates the course presence in Fauna.

const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../faunaDB");

const { Match, Map, Paginate, Get, Update, Ref, Collection, Lambda, Index, Var} = faunaDB.query;

class CheckStudentBeforePresenceConfirmation {
  constructor(input) {
    this.email = input.email,
    this.courseId = input.courseId
  }
}


router.route('/check-student-before-presence-confirmation')
  .post( async (request, response) => {
    
    const payload = request.body
    const checkStudentBeforePresenceConfirmation = new CheckStudentBeforePresenceConfirmation(payload)

    let undefinedValues;
    Object.values(checkStudentBeforePresenceConfirmation).forEach(value => {
      if (value === undefined) undefinedValues = true
    })

    // throw Error if payload passed from FrontEnd is incorrect
    if (undefinedValues) {
      response.status(422).json({
        error: "Passed data can't be undefined. Please check all key/values in your payload Object",
        tip: "Payload Object must contain following data: ** email, courseId **"
      })
      return
    }

    // query DB and search for Student
    // this will get studentData from *storedStudentLimitedData* collection
    const searchStudentInDB = await faunaClient.query(
      Map(
        Paginate(Match(Index("get_course_by_id_for_presence"), checkStudentBeforePresenceConfirmation.courseId)),
        Lambda("student", Get(Var("student")))
      )
    )

    if (searchStudentInDB.data.length != 0 ) {
      const studentEmailFromDB = searchStudentInDB.data[0].data.email
      if (studentEmailFromDB != checkStudentBeforePresenceConfirmation.email) {
        response.status(401).json({
          error: `Eroare! Din păcate nu ești înscris cu adresa e-mail: ${checkStudentBeforePresenceConfirmation.email}`,
        })
      } else {
        const data = searchStudentInDB.data[0].data
        response.status(200).json(data)
      }
    } else {
      response.status(401).json({
        error: `Te rugăm să te asiguri că ID-ul de confirmare a prezenței este cel corect.`,
      })
    }
  })

//-------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------//

class StudentCoursePresence {
  constructor(input) {
    this.id = input.id,
    this.course = input.course
  }
}

router.route('/register-student-course-presence')
  .post( async(request, response) => {
    const payload = request.body

    const studentToConfirmPresence = new StudentCoursePresence(payload)
  
    let undefinedValues;
    Object.values(studentToConfirmPresence).forEach(value => {
      if (value === undefined) undefinedValues = true
    })

    // throw Error if payload passed from FrontEnd is incorrect
    if (undefinedValues) {
      response.status(422).json({
        error: "Passed data can't be undefined. Please check all key/values in your payload Object",
        tip: "Payload Object must contain following data: ** email, course **"
      })
    } else {
      try {
        // query the DB in *storedStudentLimitedData* collection and get the student
        const studentEntryInDB = await faunaClient.query(
          Map(
            Paginate(Match(Index("get_course_by_id_for_presence"), studentToConfirmPresence.id)),
            Lambda("student", Get(Var("student")))
          )
        )
        const courseTitle = studentEntryInDB.data[0].data.course[0].title
        const courseDate = studentEntryInDB.data[0].data.course[0].date
        const coursePresence = true
        
        // reproduce the course Object model and overrite the existing one from DB
        const updatedCourse = [{
          title: courseTitle,
          date: courseDate,
          present: coursePresence
        }]
        const dataBaseEntryID = studentEntryInDB.data[0].ref.id
        await faunaClient.query(
          Update(
            Ref(Collection('storedStudentLimitedData'), dataBaseEntryID),
            { data: { course: updatedCourse} }
          )
        )

        response.status(200).json({
          message: `Success! Student's presence for *${studentToConfirmPresence.course.title}* has just been confirmed!`,
          accessLink: "https://www.zoom.com",
          courseName: studentToConfirmPresence.course.title,
        })
      } catch (error) {
        console.log(error)
        response.status(422).json({
          error: `Student's presence at *${studentToConfirmPresence.course.title}* could not be confirmed in data base`
        })
      }
    }
  })


module.exports = router