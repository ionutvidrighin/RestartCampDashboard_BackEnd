const express = require("express")
const router = express.Router()
const faunaDB = require("faunadb")
const faunaClient = require("../FaunaDataBase/faunaDB")
const collections = require('../FaunaDataBase/collections')
const indexes = require('../FaunaDataBase/indexes')
const isEqual = require('lodash.isequal')
const dayjs = require('dayjs')
const localizedFormat = require('dayjs/plugin/localizedFormat')
const localeRO = require('dayjs/locale/ro')
const CreateNewStudent = require('./helperClasses').CreateNewStudent
const sendConfirmationEmailAfterRegistration = require('../Nodemailer/EmailConfirmationRegistrationTEMPLATE/sendEmailConfirmationAfterRegistration')
dayjs.extend(localizedFormat)

const { Match, Map, Paginate, Get, Create, Collection, Documents, Lambda, Index, Var} = faunaDB.query;

router.route('/register-student')
  .post( async (request, response) => {

    const newStudent = new CreateNewStudent(request.body)
    const newStudentPresence = {
      id: request.body.id,
      fullName: request.body.fullName,
      phone: request.body.phoneNo,
      email: request.body.email,
      course: request.body.course[0]
    }

    // check if any of the values in the Object coming from FrontEnd is undefined
    // if it is, throw an error as response (this is a precaution to make sure the data stored to DB is right)
    let undefinedValues;
    Object.values(newStudent).forEach(value => {
      if (value === undefined) undefinedValues = true
    })

    if (undefinedValues) {
      response.status(422).json({
        error: "Passed data can't be undefined. Please check all key/values in your payload Object",
        tip: "Payload Object must contain following data: ** id, appellation, firstName, lastName, phoneCode, phoneNo, email, address, county, job, remarks, reference, is_career, is_business, domain, course, registrationDate, year_month **"
      })
      return
    }

    // get the Email Confirmation Registration TEMPLATE from DB
    const emailConfirmationRegistrationTemplate = await faunaClient.query(
      Map(
        Paginate(Documents(Collection(collections.EMAIL_CONFIRMATION_REGISTRATION))),
        Lambda(x => Get(x))
      )
    )

    // prepare the data needed to send confirmation e-mail after new registration
    // sendConfirmationEmailAfterRegistration() function will be called down the logic
    const studentEmailAddress = request.body.email
    const emailTemplate = emailConfirmationRegistrationTemplate.data[0].data
    const courseData = {
      name: request.body.course[0].title,
      logo: request.body.course[0].logo,
      date: dayjs(request.body.course[0].date).locale('ro').format('LL'),
      hour: `${dayjs(request.body.course[0].date).hour()}:${dayjs(request.body.course[0].date).minute()}`,
      link_page: request.body.course[0].link_page,
    }
    /******************************************************* */

    // query the DB in *registeredStudents* collection to check if student already exists
    // searching the student by his e-mail address
    const getStudentByEmail = await faunaClient.query(
      Map(
        Paginate(Match(Index(indexes.GET_STUDENT_COURSE_MODULE1_BY_EMAIL), newStudent.email)),
        Lambda("student", Get(Var("student")))
      )
    )

    // scenario: Student E-mail address doesn't exist in DB
    // we will register the Student as a new entry in DB
    // and send him a confirmation e-mail
    if (getStudentByEmail.data.length === 0) {
      try {
        // Store newly registered student to DB
        await faunaClient.query(
          Create(Collection(collections.REGISTER_STUDENT_COURSE_MODULE1), {
            data: newStudent
          })
        )

        // Store newly registered student to DB for course presence (different collection)
        await faunaClient.query(
          Create(Collection(collections.COURSES_MODULE_1_PRESENCE), {
            data: newStudentPresence
          })
        )
        response.status(200).json({
          message: `Te-ai înscris cu success! rugăm să-ti verifici inbox-ul adresei ${newStudent.email}`,
          warning: "success"
        })

        // send confirmation e-mail to student
        const sentEmailStatus = await sendConfirmationEmailAfterRegistration(studentEmailAddress, emailTemplate, courseData)
        console.log(sentEmailStatus)
      } catch (error) {
        console.log(error)
        response.status(422).json({
          message: "A apărut o eroare. Te rugăm să iei legătura cu noi cât mai repede!",
          warning: "error"
        })
      }
    } else { 
      // scenario: Student E-mail address exists in DB

      // mapping all Student Data returned by DB 
      // (a student may register multiple times with the same e-mail address)
      // (but the course he registers for, must always be different)
      const studentEntriesRawData = getStudentByEmail.data.map(entry => entry.data)
      
      // getting the course he registers for now:
      const newCourse = newStudent.course[0]

      // check if any of the COURSES to which he is already registered (the ones from DB)
      // is the same with the COURSE to which he registers now (comparing the Course Objects with Lodash "isEqual")
      let coursesAreEqual = null
      let conflictingCourse = { }
      studentEntriesRawData.forEach(entry => {
        // extract the course Object from the student object data returned by DB
        const dbCourse = entry.course[0]

        // remove the courseID in each Course Object (both those from DB and the new one he registers now) 
        // because these values will differ, since FrontEnd always sends unique courseID
        // remaining data in Course Object (object properties) is the same in both
        delete dbCourse.id
        delete newCourse.id

        // check the actual equality
        if (isEqual(dbCourse, newCourse)) {
          coursesAreEqual = true
          Object.assign(conflictingCourse, {
            title: entry.course[0].title,
            date: dayjs(entry.course[0].date).locale(localeRO).format('LL')
          })
        } else {
          coursesAreEqual = false
        }
      })

      if (coursesAreEqual) {
        // new Course he registers now, is the same with a Course in DB
        // Course Title and Course Date are the same
        response.status(406).json({
          courseTitle: conflictingCourse.title,
          courseDate: conflictingCourse.date,
          warning: 'already-registered-at-this-course'
        })
      } else { 
        // No DB Course is equal to the one he registers now
        // we will register the Student as a new entry in DB
        // and send him a confirmation e-mail
        try {
          // Store registered student to DB
          await faunaClient.query(
            Create(Collection(collections.REGISTER_STUDENT_COURSE_MODULE1), {
              data: newStudent
            })
          )

          // Store registered student to DB for course presence (different collection)
          await faunaClient.query(
            Create(Collection(collections.COURSES_MODULE_1_PRESENCE), {
              data: newStudentPresence
            })
          )

          response.status(200).json({
            message: `Te-ai înscris cu success! Te rugăm să-ti verifici inbox-ul adresei ${studentEmailAddress}`,
            warning: 'success'
          })

          // send confirmation e-mail to student
          const sentEmailStatus = await sendConfirmationEmailAfterRegistration(studentEmailAddress, emailTemplate, courseData)
          console.log(sentEmailStatus)

        } catch (error) {
          console.log(error)
          response.status(422).json({
            message: "A apărut o eroare. Te rugăm să iei legătura cu noi cât mai repede!",
            warning: "error"
          })
        }
      }
    }
  })

module.exports = router