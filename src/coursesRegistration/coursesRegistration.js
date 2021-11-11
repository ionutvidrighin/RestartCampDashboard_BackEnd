const express = require("express");
const router = express.Router();
const faunaDB = require("faunadb");
const faunaClient = require("../faunaDB");
const allUsersRegistered = require('./usersRegistered');

const { Match, Map, Paginate, Get, Create, Collection, Lambda, Index, Var} = faunaDB.query;

class RestartCampUser {
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
    this.courses = input.courses
    this.date = input.date,
    this.year_month = input.year_month
  }
}

router.route('/get-by-date')
  .get(async (req, res) => {
   
    const searchString = '2021-11'
    const returnedSearchedData = await faunaClient.query(
      Map(
        Paginate(Match(Index("get_by_year_month"), searchString)),
        Lambda("users", Get(Var("users")))
      )
    )

    returnedSearchedData.data.forEach(item => console.log(item.data))
    res.json(getUsersByDate)
  })

router.route('/register-user')
  .get( (req, res) => {
    res.status(200).json(allUsersRegistered)
  })

  .post( (req, res) => {
    const user = req.body
    const newUser = new RestartCampUser(user)

    let newID = 0
    let existingIDs = []
    allUsersRegistered.forEach(user => existingIDs.push(user.id))

    while(existingIDs.indexOf(newID) != -1) {
      newID++
    }

    Object.assign(newUser, {id: newID})
    
    allUsersRegistered.push(newUser)
    res.status(200).json({ data: 'adaugat cu success' })
  })

/*router.route("/courses-registration")
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

    if (typeof id === 'number' &&
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
    }
  })*/

module.exports = router