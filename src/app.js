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
const coursesWebPageData = require('./FreeEndpoints/EditingWebpagesData/CoursesPageData');
const coursePresencePageData = require('./FreeEndpoints/EditingWebpagesData/CoursePresencePageData');
const headerFooterWebPageData = require('./FreeEndpoints/EditingWebpagesData/HeaderFooterData');
const registrationFormAlerts = require('./FreeEndpoints/EditingWebpagesData/RegistrationFormAlerts');

// locked (with token) enpoints:
const dashboardUsers = require('./LockedEndpoints/adminSection/dashboardUsersAccounts');
const getAppAccessKey = require('./LockedEndpoints/adminSection/appAccessKey');
const changeUserAccountEmail = require('./Authentication/changeUserAccountEmail');
const changeUserAccountPassword = require('./Authentication/changeUserAccountPassword');
const getRegisteredStudents = require('./LockedEndpoints/coursesRegistration/getRegisteredStudents');
const getStudentCoursesPresence = require('./LockedEndpoints/coursesPresence/getStudentCoursesPresence');
const coursesModule1 = require('./LockedEndpoints/coursesModule1/coursesModule1');
const coursesModule2 = require('./LockedEndpoints/coursesModule2/coursesModule2');
const emailConfirmationAfterRegistration = require('./LockedEndpoints/emailConfirmationAfterRegistration/emailConfirmationModule1');
const email3DaysAfterRegistrationEmployee = require('./LockedEndpoints/email3DaysAfterRegistration/email3DaysAfterRegistrationEmployee');
const email3DaysAfterRegistrationCompany = require('./LockedEndpoints/email3DaysAfterRegistration/email3DaysAfterRegistrationCompany');
const emailReminder7Days = require('./LockedEndpoints/emailReminder7Days/emailReminder7Days');
const emailReminder1Day = require('./LockedEndpoints/emailReminder1Day/emailReminder1Day');
const emailReminder1Hour = require('./LockedEndpoints/emailReminder1Hour/emailReminder1Hour');

// Unsubscribe or Remove a Student - endpoints
const studentDataForUnsubscribeOrRemove = require('./LockedEndpoints/unsubscribeOrRemoveStudent/studentDataForUnsubscribeOrRemove');


app.set('trust proxy', 1)

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

// Unlocked endpoints
app.use(registerStudent)
app.use(registerStudentPresence)
app.use(getCoursesForWebPage)
app.use(coursesWebPageData)
app.use(coursePresencePageData)
app.use(headerFooterWebPageData)
app.use(registrationFormAlerts)

// Dashboard Users
app.use(dashboardLogin)
app.use(dashboardUsers)
app.use(getAppAccessKey)
app.use(changeUserAccountEmail)
app.use(changeUserAccountPassword)

// Get-Post courses data
app.use(coursesModule1)
app.use(coursesModule2)

// Get-Post Students data for Tables / Charts
app.use(getRegisteredStudents)
app.use(getStudentCoursesPresence)

// Get-Post Unsubscribe/Delete Student data
app.use(studentDataForUnsubscribeOrRemove)

// Get-Post E-mail templates
app.use(emailConfirmationAfterRegistration)
app.use(email3DaysAfterRegistrationEmployee)
app.use(email3DaysAfterRegistrationCompany)
app.use(emailReminder7Days)
app.use(emailReminder1Day)
app.use(emailReminder1Hour)


const defaultResponse = require('./defaultResponse')

app.get('/', async (req, res) => {
  res.send(defaultResponse)
})

module.exports = app;