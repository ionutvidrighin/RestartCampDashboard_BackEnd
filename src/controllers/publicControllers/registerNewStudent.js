const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const collections = require('../../FaunaDataBase/collections');
const indexes = require('../../FaunaDataBase/indexes');
const isEqual = require('lodash.isequal');
const dayjs = require('dayjs');
const localeRO = require('dayjs/locale/ro');
const localizedFormat = require('dayjs/plugin/localizedFormat');
const CreateNewStudent = require('./helperClass').CreateNewStudent
const sendConfirmationEmailAfterRegistration = require('../../Nodemailer/EmailConfirmationRegistration/sendEmailConfirmationAfterRegistration');
const sendScheduledEmail3DaysAfterRegistration = require('../../Nodemailer/Email3DaysAfterRegistration/sendEmailAfter3DaysRegistration');
dayjs.extend(localizedFormat)

const { Map, Create, Collection, Paginate, Match, Get, Lambda, Update, Ref, Index, Var } = faunaDB.query

// function taking care of registering a Student to data base
const registerNewStudent = async (request, response) => {
  const newStudent = new CreateNewStudent(request.body)
  const newStudentPresence = {
    id: request.body.id,
    fullName: request.body.fullName,
    phone: request.body.phoneNo,
    email: request.body.email,
    course: request.body.course[0]
  }

  /*
  // check if any of the values in the Object coming from FrontEnd is undefined
  // if it is, throw an error as response (this is a precaution to make sure the data stored to DB has the right format)
  let undefinedValues;
  Object.values(newStudent).forEach(value => {
    if (value === undefined) undefinedValues = true
  })

  if (undefinedValues) {
    response.status(422).json({
      error: "Passed data can't be undefined. Please check all key/values in your payload Object",
      tip: "Payload Object must contain following data: ** id, appellation, fullName, phoneCode, phoneNo, email, address, county, job, remarks, reference, career, domain, course, registrationDate, year_month **"
    })
    return
  }*/

  try {
    /* query data base to check if student is already registered
    *  NOTE: student may register multiple times with the same e-mail address
    *       however the course he register for, has to be unique
    *       (student can't register multiple times for the same exact course)
    */
    const searchStudent = await faunaClient.query(
      Map(
        Paginate(Match(Index(indexes.GET_STUDENT_IN_COURSES_MODULE1_BY_EMAIL), newStudent.email)),
        Lambda("student", Get(Var("student")))
      )
    )

    /* preparing data needed to send the e-mails out */
    const studentType = newStudent.career
    const studentRegistrationDate = newStudent.registrationDate
    const studentEmailAddress = newStudent.email
    const courseData = {
      name: newStudent.course[0].title,
      logo: newStudent.course[0].logo,
      date: dayjs(newStudent.course[0].date).locale('ro').format('LL'),
      hour: `${dayjs(newStudent.course[0].date).hour()}:${dayjs(newStudent.course[0].date).minute()}`,
      link_page: newStudent.course[0].link_page,
    }

    if (searchStudent.data.length === 0) {
      /** scenario: student doesn't exist in data base **/

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

      //send registration confirmation e-mail to student
      await sendConfirmationEmailAfterRegistration(studentEmailAddress, courseData)
      // send scheduled email - 3 days after registration
      sendScheduledEmail3DaysAfterRegistration(studentEmailAddress, studentRegistrationDate, studentType)

      response.status(200).json({
        message: `Te-ai înscris cu success! Te rugăm să-ti verifici inbox-ul adresei ${newStudent.email}`,
        warning: "success"
      })

    } else {
      /** scenario: student exists in data base **/
      /* at this point we need to go through all his registrations
      *  and compare the course he selected now for this new registration,
      *  with each course he already registered for in the past
      */

      const allStudentRegistrations = searchStudent.data.map(entry => entry.data)
      let coursesAreEqual = null
      let conflictingCourse = {}
      allStudentRegistrations.forEach(registration => {
        const existingCourse = registration.course[0]
        const newCourse = newStudent.course[0]

        // removing the course id from both course Objects (because they are different - FrontEnd sends unique ID every time)
        delete existingCourse.id
        delete newCourse.id

        // check if courses are equal
        if (isEqual(existingCourse, newCourse)) {
          coursesAreEqual = true
          Object.assign(conflictingCourse, {
            title: existingCourse.title,
            date: dayjs(existingCourse.date).locale(localeRO).format('LL')
          })
        } else {
          coursesAreEqual = false
        }
      })

      if (coursesAreEqual) {
        /* Student is already registered for this course */
        response.status(406).json({
          courseTitle: conflictingCourse.title,
          courseDate: conflictingCourse.date,
          warning: 'already-registered-at-this-course'
        })
      } else {
        /* Student is not registered for this course */
        /* will treat this scenario as a new registration */

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

        //send registration confirmation e-mail to student
        await sendConfirmationEmailAfterRegistration(studentEmailAddress, courseData)
        // send scheduled email - 3 days after registration
        //await sendScheduledEmail3DaysAfterRegistration(studentEmailAddress, studentRegistrationDate, studentType)

        response.status(200).json({
          message: `Te-ai înscris cu success! Te rugăm să-ti verifici inbox-ul adresei ${studentEmailAddress}`,
          warning: 'success'
        })
      }
    }
  } catch (error) {
    console.log(error)
    response.status(422).json({
      message: "A apărut o eroare. Te rugăm să iei legătura cu noi cât mai repede!",
      warning: "error"
    })
  }
}

module.exports = registerNewStudent