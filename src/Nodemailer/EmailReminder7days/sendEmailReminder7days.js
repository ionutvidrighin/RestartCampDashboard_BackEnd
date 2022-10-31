const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const dayjs = require('dayjs');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const createTemplateContext = require('./createTemplateContext');
const { emailSubject } = require('./emailSubject.json');


module.exports = function sendScheduledEmailReminder7days(recipientEmail, courseStartDate) {
  // subtract 7 days from course start date to send a reminder
  const sevenDaysBeforeCourseStart = dayjs(courseStartDate).subtract(7, 'days').format()
  
  schedule.scheduleJob(sevenDaysBeforeCourseStart, async () => {
    sendEmailReminder7days(recipientEmail)
  
    console.log('==========7 DAYS Reminder E-MAIL SENDING==========')
    console.log('E-mail sent to ' + recipientEmail + ' on ' + dayjs().format())
  })
}

const sendEmailReminder7days = async (recipientEmail) => {
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
      template: 'emailReminder7days',
      context: createTemplateContext()
    }

    transporter.verify(function (error, success) {
      if (error) {
        console.log(error)
      } else {
        console.log("Server is about to send *7 Days Email Reminder* e-mail to " + recipientEmail)
      }
    })
    
    return await transporter.sendMail(options)

  } catch (error) {
    return error
  }
}