const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const dayjs = require('dayjs');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const createTemplateContext = require('./createTemplateContext');
const { emailSubject } = require('./emailSubject.json');


module.exports = function sendScheduledEmailReminder1Hour(recipientEmail, courseStartDate, courseData) {
  console.log('time of course is -> ', courseStartDate)
  // subtract 1 hour from course start, to send a reminder
  const oneHourBeforeCourseStart = dayjs(courseStartDate).subtract(3, 'minute').format()
  console.log('time now is ->', dayjs().format())
  console.log('time when email will be sent ->', oneHourBeforeCourseStart)
  
  schedule.scheduleJob(oneHourBeforeCourseStart, async () => {
    await sendEmailReminder1Hour(recipientEmail, courseData)
  
    console.log('==========1HOUR Reminder E-MAIL SENDING==========')
    console.log('E-mail sent to ' + recipientEmail + ' on ' + dayjs().format())
  })
}

const sendEmailReminder1Hour = async (recipientEmail, courseData) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.ionos.co.uk",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'echipa@restart-camp.org',
        pass: process.env.EMAIL_PASSW
      }
    })

    const handlebarOptions = {
      viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve(__dirname, "template"),
        defaultLayout: false
      },
      viewPath: path.resolve(__dirname, "template"),
      extName: ".handlebars"
    }

    transporter.use("compile", hbs(handlebarOptions))
    
    let options = {
      from: '"RestartCamp" <echipa@restart-camp.org>', // sender e-mail address
      to: recipientEmail, // recipient e-mail address
      subject: emailSubject,
      template: 'emailReminder1hour',
      context: createTemplateContext(courseData)
    }

    transporter.verify(function (error, success) {
      if (error) {
        console.log(error)
      } else {
        console.log("Server is about to send *1 hour Email Reminder* e-mail to " + recipientEmail)
      }
    })
    
    return await transporter.sendMail(options)

  } catch (error) {
    return error
  }
}