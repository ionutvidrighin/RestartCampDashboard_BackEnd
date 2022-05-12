const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../FaunaDataBase/faunaDB");
const isEqual = require('lodash.isequal');
const dayjs = require('dayjs');
const localizedFormat = require('dayjs/plugin/localizedFormat')
const localeRO = require('dayjs/locale/ro');
//const sendConfirmationEmailAfterRegistration = require("../Nodemailer/ConfirmationEmailTemplate/sendConfirmationEmailAfterRegistration");
const storedStudentFullDataJSON = require("../JSON_Files/storedStudentFullData");
const storedStudentLimitedDataJSON = require("../JSON_Files/storedStudentLimitedData");
dayjs.extend(localizedFormat)

const { Match, Map, Paginate, Get, Create, Collection, Lambda, Index, Var} = faunaDB.query;

class CreateStudentFullData {
  constructor(input) {
    this.id = input.id
    this.firstName = input.firstName
    this.lastName = input.lastName
    this.phoneNo = input.phoneNo
    this.email = input.email
    this.job = input.job
    this.remarks = input.remarks
    this.reference = input.reference
    this.is_career = input.is_career
    this.is_business = input.is_business
    this.domain = input.domain
    this.course = input.course
    this.registrationDate = input.registrationDate,
    this.year_month = input.year_month
  }
}
class CreateStudentLimitedData {
  constructor(input) {
    this.id = input.id
    this.firstName = input.firstName
    this.lastName = input.lastName
    this.phoneNo = input.phoneNo
    this.email = input.email
    this.course = input.course
    this.registrationDate = input.registrationDate,
    this.year_month = input.year_month
  }
}

router.route('/register-student')
  .post( async (request, response) => {
    const registeredStudent = request.body

    const newStudentFullData = new CreateStudentFullData(registeredStudent)
    const newStudentLimitedData = new CreateStudentLimitedData(registeredStudent)

    // check if any of the values in the Object coming from FrontEnd is undefined
    // if it is, throw an error as response
    let undefinedValues;
    Object.values(newStudentFullData).forEach(value => {
      if (value === undefined) undefinedValues = true
    })

    if (undefinedValues) {
      response.status(422).json({
        error: "Passed data can't be undefined. Please check all key/values in your payload Object",
        tip: "Payload Object must contain following data: ** id, firstName, lastName, phoneNo, email, job, remarks, reference, is_career, is_business, domain, course, registrationDate, year_month **"
      })
      return
    }

    /** creating the payload for |sendConfirmationEmailAfterRegistration| function  */
    const course_name = request.body.course[0].title
    const course_date = dayjs(request.body.course[0].date).locale(localeRO).format('LL')
    const student_email = request.body.email

    const payload = {
      course_name,
      course_date,
      student_email
    }
    /******************************************************* */

    // query the DB in *storedStudentFullData* collection to check if student already exists
    const searchStudentEmail = await faunaClient.query(
      Map(
        Paginate(Match(Index("get_student_before_new_registration"), newStudentFullData.email)),
        Lambda("student", Get(Var("student")))
      )
    )

    // case for when Student E-mail address doesn't exist in DB
    // we will register the Student as a new entry in DB
    if (searchStudentEmail.data.length === 0) {
      try {
        await faunaClient.query(
          Create(Collection("storedStudentFullData"), {
            data: newStudentFullData
          })
        )
        await faunaClient.query(
          Create(Collection("storedStudentLimitedData"), {
            data: newStudentLimitedData
          })
        )
        response.status(200).json({
          message: `Te-ai înscris cu success! rugăm să-ti verifici inbox-ul adresei ${newStudentFullData.email}`,
          warning: "success"
        })

        //sendConfirmationEmailAfterRegistration(payload)

      } catch (error) {
        console.log(error)
        response.status(422).json({
          message: "A apărut o eroare. Te rugăm să iei legătura cu noi cât mai repede!",
          warning: "error"
        })
      }

    } else {
      const studentEmailAddress = searchStudentEmail.data[0].data.email
      const existingCourseInDB = searchStudentEmail.data[0].data.course[0]
      const courseFromPayload = newStudentFullData.course[0]
      const coursesAreEqual = isEqual(existingCourseInDB, courseFromPayload)

      if (coursesAreEqual) {
        const courseDate = dayjs(existingCourseInDB.date).locale(localeRO).format('LL')
        response.status(406).json({
          message: `Ești deja înscris la cursul **${existingCourseInDB.title}** din data de ${courseDate}`,
          warning: 'warning'
        })
        return
      } 

      try {
        await faunaClient.query(
          Create(Collection("storedStudentFullData"), {
            data: newStudentFullData
          })
        )
        await faunaClient.query(
          Create(Collection("storedStudentLimitedData"), {
            data: newStudentLimitedData
          })
        )
        response.status(200).json({
          message: `Te-ai înscris cu success! Te rugăm să-ti verifici inbox-ul adresei ${studentEmailAddress}`,
          warning: 'success'
        })
        //sendConfirmationEmailAfterRegistration(payload)
      } catch (error) {
        console.log(error)
        response.status(422).json({
          message: "A apărut o eroare. Te rugăm să iei legătura cu noi cât mai repede!",
          warning: "error"
        })
      }
    }
  })

module.exports = router