// initializing Express Server
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

// importing all routes

// unlocked (without token) endpoints:
const registerStudent = require('./FreeEndpoints/registerStudent');
const registerStudentPresence = require('./FreeEndpoints/registerStudentPresence');
const getCoursesForWebPage = require('./FreeEndpoints/getCoursesForWebPage');
const dashboardLogin = require('./Authentication/login');

// locked (wit token) enpoints:
const changeUserAccountEmail = require('./Authentication/changeUserAccountEmail');
const changeUserAccountPassword = require('./Authentication/changeUserAccountPassword');
const getRegisteredStudents = require('./LockedEndpoints/coursesRegistration/getRegisteredStudents');
const getStudentCoursesPresence = require('./LockedEndpoints/coursesPresence/getStudentCoursesPresence');
const freeCoursesForDashboard = require('./LockedEndpoints/freeCourses/freeCourses');
const paidCoursesForDashboard = require('./LockedEndpoints/paidCourses/paidCourses');

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
app.use(registerStudentPresence)
app.use(getRegisteredStudents)
app.use(getStudentCoursesPresence)
app.use(freeCoursesForDashboard)
app.use(paidCoursesForDashboard)
app.use(getCoursesForWebPage)


const users = require('./users')

app.get('/', async (req, res) => {
  res.send(users)
})

module.exports = app;