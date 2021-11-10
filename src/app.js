// initializing Express Server
const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
const helmet = require('helmet')

// importing all routes
const loginToApp = require('./Authentication/login.js')
const changeUserAccountEmail = require('./Authentication/changeUserAccountEmail.js')
const changeUserAccountPassword = require('./Authentication/changeUserAccountPassword.js')
const coursesRegistration = require('./coursesRegistration/coursesRegistration')
const freeCoursesDashboard = require('./freeCourses/freeCourses')
const paidCoursesDashboard = require('./paidCourses/paidCourses')
const freeCoursesForWebPage = require('./FreeAccessAPI/coursesForWebPage')

const app = express()
app.set('trust proxy', 1)

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

app.use(loginToApp)
app.use(changeUserAccountEmail)
app.use(changeUserAccountPassword)
app.use(coursesRegistration)
app.use(freeCoursesDashboard)
app.use(paidCoursesDashboard)
app.use(freeCoursesForWebPage)

const users = require('./users')

app.get('/', async (req, res) => {
  res.send(users)
})

/*
let transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'ionut-test@outlook.com', // generated ethereal user
    pass: 'IONUT123', // generated ethereal password
  }
})

let options = {
  from: '"RestartCamp  💌" <ionut-test@outlook.com>', // sender address
  to: [], // list of receivers
  bcc: addresses,
  subject: "Hello from Restart Camp - Test ✔", // Subject line
  text: "Hello world?", // plain text body
  html: "<b>Hello world?</b>", // html body
}

// transporter.sendMail(options, (error, info) => {
//   if (error) {
//     console.log(error)
//     return
//   }
//   console.log(info.response)
// })



app.delete('/remove/:id', async (incomingData, res) => {
  const elementToRemove = incomingData.params
  console.log(incomingData)
  console.log(elementToRemove)
  await client.query(
    Delete(
      Ref(
        Collection("ionut"), elementToRemove.id
      )
    )
  )
  res.send({
    data: 'deleted!'
  })
})*/



module.exports = app;