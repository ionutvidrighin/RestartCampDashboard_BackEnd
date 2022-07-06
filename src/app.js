// initializing Express Server
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const app = express()

// importing all routes

// unlocked (without token) endpoints:
const registerStudent = require('./FreeEndpoints/registerStudent');
const registerStudentPresence = require('./FreeEndpoints/registerStudentPresence');
const getCoursesForWebPage = require('./FreeEndpoints/getCoursesForWebPage');
const dashboardLogin = require('./Authentication/login');
const coursesWebPageData = require('./FreeEndpoints/CoursesPageData');
const headerFooterWebPageData = require('./FreeEndpoints/HeaderFooterData');

// locked (with token) enpoints:
const dashboardUsers = require('./LockedEndpoints/adminSection/dashboardUsersAccounts');
const getAppAccessKey = require('./LockedEndpoints/adminSection/appAccessKey');
const changeUserAccountEmail = require('./Authentication/changeUserAccountEmail');
const changeUserAccountPassword = require('./Authentication/changeUserAccountPassword');
const getRegisteredStudents = require('./LockedEndpoints/coursesRegistration/getRegisteredStudents');
const getStudentCoursesPresence = require('./LockedEndpoints/coursesPresence/getStudentCoursesPresence');
const coursesModule1 = require('./LockedEndpoints/coursesModule1/coursesModule1');
const coursesModule2 = require('./LockedEndpoints/coursesModule2/coursesModule2');
const emailConfirmationAfterRegistration = require('./LockedEndpoints/emailConfirmationAfterRegistration/emailConfirmationModule1')
const emailReminder7Days = require('./LockedEndpoints/emailReminder7Days/emailReminder7Days')
const emailReminder1Day = require('./LockedEndpoints/emailReminder1Day/emailReminder1Day')
const emailReminder1Hour = require('./LockedEndpoints/emailReminder1Hour/emailReminder1Hour')

app.set('trust proxy', 1)

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())


app.use(dashboardLogin)
app.use(registerStudent)
app.use(registerStudentPresence)
app.use(getCoursesForWebPage)
app.use(coursesWebPageData)
app.use(headerFooterWebPageData)

app.use(dashboardUsers)
app.use(getAppAccessKey)
app.use(changeUserAccountEmail)
app.use(changeUserAccountPassword)
app.use(getRegisteredStudents)
app.use(getStudentCoursesPresence)
app.use(coursesModule1)
app.use(coursesModule2)
app.use(emailConfirmationAfterRegistration)
app.use(emailReminder7Days)
app.use(emailReminder1Day)
app.use(emailReminder1Hour)


const defaultResponse = require('./defaultResponse')

app.get('/', async (req, res) => {
  res.send(defaultResponse)
})

module.exports = app;