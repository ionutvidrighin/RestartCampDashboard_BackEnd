// initializing Express Server
const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsConfig');
const helmet = require('helmet');
const app = express();

app.set('trust proxy', 1);

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// unlocked (without token) endpoints:
const dashboardLogin = require('./Authentication/login');
app.use(dashboardLogin);

// ____________________PUBLIC_ENDPOINTS______________________ //
const registerStudent = require('./routes/publicRoutes/registerStudent');
app.use(registerStudent);
const getAllCourses = require('./routes/publicRoutes/coursesBothModules');
app.use(getAllCourses);
const getPublicWebpagesData = require('./routes/publicRoutes/publicWebpagesData');
app.use(getPublicWebpagesData);
const updateWebpagesData = require('./routes/updateWebpagesData/updateWebPagesData');
app.use(updateWebpagesData);

// locked (with token) enpoints:
const changeUserAccountEmail = require('./Authentication/changeUserAccountEmail');
const changeUserAccountPassword = require('./Authentication/changeUserAccountPassword');

// ______________________ADMIN_ENDPOINTS__________________________ //
const dashboardAccessKey = require('./routes/adminRoutes/appAccessKey');
app.use(dashboardAccessKey);
const dashboardUsers = require('./routes/adminRoutes/dashboardUsers');
app.use(dashboardUsers);

// ____________________COURSES_DATA_ENDPOINTS_______________________ //
const coursesModule1 = require('./routes/coursesRoutes/coursesModule1');
app.use(coursesModule1);
const coursesModule2 = require('./routes/coursesRoutes/coursesModule2');
app.use(coursesModule2);

// ____________________STUDENTS_DATA_ENDPOINTS______________________ //
const studentsInCoursesModule1 = require('./routes/registeredStudentsRoutes/studentsCourseModule1');
app.use(studentsInCoursesModule1);
const studentsInCoursesPresenceModule1 = require('./routes/registeredStudentsRoutes/studentsPresenceAtCourseModule1');
app.use(studentsInCoursesPresenceModule1);
const unsubscribeOrRemoveStudent = require('./routes/registeredStudentsRoutes/unsubscribeOrRemoveStudent');
app.use(unsubscribeOrRemoveStudent);

// ____________________EMAIL_TEMPLATES_ENDPOINTS_____________________ //
const emailConfirmationAfterRegistration = require('./routes/emailTemplatesRoutes/emailConfirmationRegistration');
app.use(emailConfirmationAfterRegistration);
const email3DaysAfterRegistrationEmployee = require('./routes/emailTemplatesRoutes/email3DaysAfterRegistrationEmployee');
app.use(email3DaysAfterRegistrationEmployee);
const email3DaysAfterRegistrationCompany = require('./routes/emailTemplatesRoutes/email3DaysAfterRegistrationBusiness');
app.use(email3DaysAfterRegistrationCompany);


const defaultResponse = require('./defaultResponse')
app.get('/', async (req, res) => {
  res.send(defaultResponse)
})

module.exports = app;