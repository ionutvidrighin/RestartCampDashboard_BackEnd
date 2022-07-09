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
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      phone: request.body.phone,
      email: request.body.email,
      course: {
        ...request.body.course[0],
        date: dayjs(request.body.course.date).format('MM/DD/YYYY')
      }
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
        tip: "Payload Object must contain following data: ** id, appellation, firstName, lastName, phoneNo, email, address, county, job, remarks, reference, is_career, is_business, domain, course, registrationDate, year_month **"
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
    const sendEmailPayload = {
      emailTemplate: emailConfirmationRegistrationTemplate.data[0].data,
      course_name: request.body.course[0].title,
      course_logo: request.body.course[0].logo,
      course_date: request.body.course[0].date,
      course_link_page: request.body.course[0].link_page,
      student_email: request.body.email
    }
    /******************************************************* */

    // query the DB in *registeredStudents* collection to check if student already exists
    const getStudentByEmail = await faunaClient.query(
      Map(
        Paginate(Match(Index(indexes.GET_STUDENT_COURSE_MODULE1_BY_EMAIL), newStudent.email)),
        Lambda("student", Get(Var("student")))
      )
    )

    // scenario: Student E-mail address doesn't exist in DB
    // we will register the Student as a new entry in DB
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
        const sentEmailStatus = await sendConfirmationEmailAfterRegistration(sendEmailPayload)
        console.log(sentEmailStatus)
      } catch (error) {
        console.log(error)
        response.status(422).json({
          message: "A apărut o eroare. Te rugăm să iei legătura cu noi cât mai repede!",
          warning: "error"
        })
      }
    } else { // scenario: Student E-mail address exists in DB
      const studentEntriesRawData = getStudentByEmail.data.map(entry => entry.data)
      
      // check if any of the COURSES to which student is already registered (the ones from DB)
      // is the same with the COURSE to which he registers now (comparing the Course Objects)
      const newCourse = newStudent.course[0]

      let coursesAreEqual = null
      let existingCourse = {
        title: null,
        date: null
      }
      studentEntriesRawData.forEach(entry => {
        const individualCourse = entry.course[0]
        // remove the course ID in each Object 
        // because the course ID coming from FrontEnd is always different for every new registration
        // all the rest is the same when courses are equal  
        delete individualCourse.id
        delete newCourse.id

        if (isEqual(individualCourse, newCourse)) {
          coursesAreEqual = true
          Object.assign(existingCourse, {
            title: entry.course[0].title,
            date: dayjs(entry.course[0].date).locale(localeRO).format('LL')
          })
        } else {
          coursesAreEqual = false
        }
      })

      if (coursesAreEqual) { 
        // New Course he registered for now, is the same with a Course he registered in the past
        // Course Title and Course Date are the same
        response.status(406).json({
          message: `Ești deja înscris la cursul **${existingCourse.title}** din data de ${existingCourse.date}`,
          warning: 'warning'
        })
      } else { 
        // Course are not the same
        // Register the Student as a new entry to DB
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

          const studentEmailAddress = getStudentByEmail.data[0].data.email
          response.status(200).json({
            message: `Te-ai înscris cu success! Te rugăm să-ti verifici inbox-ul adresei ${studentEmailAddress}`,
            warning: 'success'
          })

          // send confirmation e-mail to student
          const sentEmailStatus = await sendConfirmationEmailAfterRegistration(sendEmailPayload)
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