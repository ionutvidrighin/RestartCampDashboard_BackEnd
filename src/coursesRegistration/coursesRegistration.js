const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../faunaDB");

const { Match, Map, Paginate, Get, Create, Collection, Lambda, Index, Var} = faunaDB.query;

class AddUserToDB {
  constructor(id, firstName, lastName, phoneNo, email, job, remarks, reference, is_career, is_business, domain, courses) {
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.phoneNo = phoneNo
    this.email = email
    this.job = job
    this.remarks = remarks
    this.reference = reference
    this.is_career = is_career
    this.is_business = is_business
    this.domain = domain
    this.courses = courses
  }
}

router.route("/courses-registration")
  .post( async(incomingData, response) => {
    const { 
      body: {
        id, 
        firstName, 
        lastName, 
        phoneNo,
        email, 
        job, 
        remarks,
        reference,
        is_career,
        is_business,
        domain,
        courses
      } 
    } = incomingData

    // console.log(courses.length)
    // console.log(typeof courses)
    console.log(incomingData.body)
    response.send('helloooo')
    let newUser = new AddUserToDB(
      id, 
      firstName, 
      lastName, 
      phoneNo,
      email, 
      job, 
      remarks,
      reference,
      is_career,
      is_business,
      domain,
      courses )
    console.log(newUser)

    let checkIfUserExists = await faunaClient.query(
      Map(
        Paginate(
          Match(Index("email"), email)
        ),
        Lambda(
          'user',
          Get(Var('user'))
        )
      )
    )

   /* if (typeof id === 'number' &&
        typeof firstName === 'string' &&
        typeof lastName === 'string' &&
        typeof email === 'string' &&
        typeof present === 'boolean' &&
        typeof course === 'string') {

      if (checkIfUserExists.data.length != 0) {
        response.status(400).json({
          error: 'User already exists!'
        })
      } else {
        let newUser = new AddUserToDB(
          id, 
          firstName, 
          lastName, 
          phoneNo,
          email, 
          job, 
          remarks,
          reference,
          is_career,
          is_business,
          domain,
          courses )
  
        await faunaClient.query(
          Create(Collection("users"), {
            data: newUser
          })
        )
        response.status(200).json({
          message: "user saved to Data Base!",
        })
      }
    } else {
      response.status(401).json({
        error: 'Incorrect schema! Please check types below',
        expectedDataTypes: {
          id: `expect: Number; Received: ${typeof id}`,
          firstName: `expect: String; Received: ${typeof firstName}`, 
          lastName: `expect: String; Received: ${typeof lastName}`,
          email: `expect: String; Received: ${typeof email}`,
          present: `expect: Boolean; Received: ${typeof present}`,
          course: `expect: String; Received: ${typeof course}`
        }
      })
    }*/
  })

module.exports = router