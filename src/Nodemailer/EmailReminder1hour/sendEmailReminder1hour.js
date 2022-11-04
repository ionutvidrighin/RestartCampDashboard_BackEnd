const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const dayjs = require('dayjs');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const schedule = require('node-schedule');
const createTemplateContext = require('./createTemplateContext');
const { emailSubject } = require('./emailSubject.json');

/*
 # ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *
*/


module.exports = function sendScheduledEmailReminder1Hour(recipientEmail, courseStartDate, courseData) {

  const subtract1Hour = dayjs(courseStartDate).subtract(4, 'minute').format()
  console.log('function is triggered')
  console.log('time now is ->', dayjs().format())
  console.log('time when email will be sent ->', subtract1Hour)


  const month = dayjs(subtract1Hour).month()
  const dayOfMonth = dayjs(subtract1Hour).date()
  const hour = dayjs(subtract1Hour).hour()
  const minute = dayjs(subtract1Hour).minute()

  console.log({
    month: month+1,
    dayOfMonth,
    hour,
    minute
  })

  const sendEmail = async () => {
    try {
      const response = await sendEmailReminder1Hour(recipientEmail, courseData)
      console.log('email response', response)
      console.log('==========1HOUR Reminder E-MAIL SENDING==========')
      console.log('E-mail sent to ' + recipientEmail + ' on ' + dayjs().format())
    } catch (error) {
      console.log('error', error)
    }
  }

  var task = cron.schedule(`${minute} ${hour} ${dayOfMonth} ${month+1} *`, () => {
    sendEmail()
  }, {
    scheduled: false
  })
  task.start()


  /*console.log('function is triggered')
  console.log('time of course is -> ', courseStartDate)

  const scheduledTime = dayjs(courseStartDate).subtract(4, 'minute').format()
  console.log('time now is ->', dayjs().format())
  console.log('time when email will be sent ->', scheduledTime)
  
  schedule.scheduleJob(scheduledTime, async () => {
    const response = await sendEmailReminder1Hour(recipientEmail, courseData)
    console.log('email response', response)
    console.log('==========1HOUR Reminder E-MAIL SENDING==========')
    console.log('E-mail sent to ' + recipientEmail + ' on ' + dayjs().format())
  })*/
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