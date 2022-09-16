const faunaDB = require("faunadb");
const faunaClient = require("../../FaunaDataBase/faunaDB");
const collections = require('../../FaunaDataBase/collections');
const indexes = require('../../FaunaDataBase/indexes');
const isEqual = require('lodash.isequal');
const dayjs = require('dayjs');
const localeRO = require('dayjs/locale/ro');
const localizedFormat = require('dayjs/plugin/localizedFormat');
const CreateNewStudent = require('./helperClass').CreateNewStudent
const sendConfirmationEmailAfterRegistration = require('../../Nodemailer/EmailConfirmationRegistrationTEMPLATE/sendEmailConfirmationAfterRegistration');
const sendScheduledEmail3DaysAfterRegistration = require('../../Nodemailer/Email3DaysAfterRegistrationtTEMPLATE/sendEmailAfter3DaysRegistration');
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
  }

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

      // Store newly registered student to data base
      await faunaClient.query(
        Create(Collection(collections.REGISTER_STUDENT_COURSE_MODULE1), {
          data: newStudent
        })
      )

      // Store newly registered student to data for course presence (different collection)
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
      *  and compare the course he selected now for new registration,
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

// function taking care of pulling Student & Course data from data base, to display it on UI 
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
      res.status(404).json({message: `☹️ Din păcate nu găsim cursul cu ID: ${courseId}. Te rugăm să corectitudinea ID-ului.`})
    } else {
      const courseName = courseData.data[0].data.course.title
  
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
  registerNewStudent,
  getCourseForPresenceConfirmByCourseId,
  confirmStudentPresenceAtCourse
}