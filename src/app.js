// initializing Express Server
const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
const helmet = require('helmet')

// importing all routes
const dashboardLogin = require('./Authentication/login')
const changeUserAccountEmail = require('./Authentication/changeUserAccountEmail')
const changeUserAccountPassword = require('./Authentication/changeUserAccountPassword')
const registerStudent = require('./FreeEndpoints/registerStudent')
const enrolledStudents = require('./LockedEndpoints/coursesRegistration/enrolledStudents')
const coursePresence = require('./LockedEndpoints/coursesPresence/coursesPresence')
const freeCoursesForDashboard = require('./LockedEndpoints/freeCourses/freeCourses')
const paidCoursesForDashboard = require('./LockedEndpoints/paidCourses/paidCourses')
const freeCoursesForWebPage = require('./FreeEndpoints/coursesForWebPage')

const app = express()
app.set('trust proxy', 1)

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

app.use(dashboardLogin)
app.use(changeUserAccountEmail)
app.use(changeUserAccountPassword)
app.use(registerStudent)
app.use(enrolledStudents)
app.use(coursePresence)
app.use(freeCoursesForDashboard)
app.use(paidCoursesForDashboard)
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