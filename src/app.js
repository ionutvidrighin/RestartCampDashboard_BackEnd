// initializing Express Server
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsConfig');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const dayjs = require('dayjs')

const today = dayjs().add(5, 'minutes').format()
const dummyCourseData = {
  name: 'Bazele HR si Testare',
  date: '15 Februarie 2022',
  hour: '18:30', 
  course_page: 'https://www.restart-camp.com/cursuri/social-media',
  logo: 'https://static.wixstatic.com/media/9a56fd_c46a6920a74e4b2a9e67604d8ac86527~mv2.png/v1/fill/w_205,h_206,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/transparent.png'
}

const scheduled = require('./Nodemailer/EmailReminder1hour/sendEmailReminder1hour')
scheduled('ionut.vidrighin@gmail.com', today, dummyCourseData)

app.set('trust proxy', 1);

//app.use(cors(corsOptions));
app.use(cors())
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload())

const defaultResponse = require('./defaultResponse')
app.get('/', async (req, res) => {
  res.send(defaultResponse)
})

// ____________________PUBLIC_ENDPOINTS______________________ //
const registerNewStudent = require('./routes/publicRoutes/registerNewStudent');
app.use(registerNewStudent);
const registerStudentPresence = require('./routes/publicRoutes/registerStudentPresenceAtCourse');
app.use(registerStudentPresence);
const getAllCourses = require('./routes/publicRoutes/coursesBothModules');
app.use(getAllCourses);
const getPublicWebpagesData = require('./routes/publicRoutes/publicWebpagesData');
app.use(getPublicWebpagesData);
const studentEmailSubscription = require('./routes/publicRoutes/studentEmailSubscription');
app.use(studentEmailSubscription);

// ____________________LOCKED_ENDPOINTS_(with Token)______________________ //
const dashboardLogin = require('./Authentication/login');
app.use(dashboardLogin);

const generateDatabaseToken = require('./routes/databaseAccess');
app.use(generateDatabaseToken)

// ______________VERIFY_DATABASE_TOKEN_MIDDLEWARE_APPLIED_TO_ALL_ENDPOINTS_BELOW_________________ //
const verifyDatabaseAccessToken = require('./middleware/verifyDataBaseAccessToken');
app.use(verifyDatabaseAccessToken)

const changeUserAccountEmail = require('./Authentication/changeUserAccountEmail');
const changeUserAccountPassword = require('./Authentication/changeUserAccountPassword');

// ______________________ADMIN_ENDPOINTS__________________________ //
const dashboardUsers = require('./routes/adminRoutes/dashboardUsers');
app.use(dashboardUsers);

// ____________________UPDATE_WEBPAGES_DATA________________________ //
const updateWebpagesData = require('./routes/updateWebpagesData/updateWebPagesData');
app.use(updateWebpagesData);

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
const getStudentData = require('./routes/registeredStudentsRoutes/getStudentData');
app.use(getStudentData);

// ____________________EMAIL_TEMPLATES_ENDPOINTS_____________________ //
const emailConfirmationAfterRegistration = require('./routes/emailTemplatesRoutes/emailConfirmationRegistration');
app.use(emailConfirmationAfterRegistration);
const email3DaysAfterRegistrationEmployee = require('./routes/emailTemplatesRoutes/email3DaysAfterRegistrationEmployee');
app.use(email3DaysAfterRegistrationEmployee);
const email3DaysAfterRegistrationCompany = require('./routes/emailTemplatesRoutes/email3DaysAfterRegistrationBusiness');
app.use(email3DaysAfterRegistrationCompany);
const emailReminder1hour = require('./routes/emailTemplatesRoutes/emailReminder1hour');
app.use(emailReminder1hour);
const emailReminder1day = require('./routes/emailTemplatesRoutes/emailReminder1day');
app.use(emailReminder1day);
const emailReminder7days = require('./routes/emailTemplatesRoutes/emailReminder7days');
app.use(emailReminder7days);
const emailVoucher18hoursAfterCourse = require('./routes/emailTemplatesRoutes/emailVoucher18hoursAfterCourse');
app.use(emailVoucher18hoursAfterCourse);
const emailVoucher4hoursAfterCourse = require('./routes/emailTemplatesRoutes/emailVoucher4hoursAfterCourse');
app.use(emailVoucher4hoursAfterCourse);

module.exports = app;