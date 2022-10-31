const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const dayjs = require('dayjs');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const createTemplateContext = require('.createTemplateContext');
const { emailSubject } = require('./emailSubject.json');


module.exports = function sendScheduledEmailReminder1Day(recipientEmail, courseStartDate) {
  // subtract 1 day from course start, to send a reminder
  const oneDayBeforeCourseStart = dayjs(courseStartDate).subtract(1, 'days').format()
  
  schedule.scheduleJob(oneDayBeforeCourseStart, async () => {
    sendEmailReminder1Day(recipientEmail)
  
    console.log('==========1DAY Reminder E-MAIL SENDING==========')
    console.log('E-mail sent to ' + recipientEmail + ' on ' + dayjs().format())
  })
}

const sendEmailReminder1Day = async (recipientEmail) => {
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
      template: 'emailReminder1day',
      context: createTemplateContext()
    }

    transporter.verify(function (error, success) {
      if (error) {
        console.log(error)
      } else {
        console.log(success)
        console.log("Server is about to send *1 Day Email Reminder* e-mail to " + recipientEmail)
      }
    })
    
    return await transporter.sendMail(options)

  } catch (error) {
    return error
  }
}