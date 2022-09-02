const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')
const createTemplateContext = require('./template/creatTemplateContext')

const EMPLOYEE = 'Employee'
const COMPANY = 'Company'

const sendEmail3DaysAfterRegistration = async (recipientEmail, emailTemplate, studentType) => {
 
  let transporter = nodemailer.createTransport({
    host: "smtp.ionos.co.uk",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'echipa@restart-camp.org', // generated ethereal user
      pass: process.env.EMAIL_PASSW, // generated ethereal password
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
    subject: `Datele de acces - cursuri gratuite Restart Camp`,
    template: studentType === EMPLOYEE ? 'email3DaysEmployee' : 'email3DaysCompany',,
    context: createTemplateContext(emailTemplate)
  }

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error)
    } else {
      console.log("Server is ready to take our messages")
    }
  })
  
  return await transporter.sendMail(options)
}

module.exports = sendEmail3DaysAfterRegistration

// cron job generator
// https://crontab.guru/

var cron = require('node-cron');
//35 15 11 5 *

// cron.schedule('35 15 11 5 *', () => {
//   sendConfirmationEmailAfterRegistration(test)
// });

// const d = dayjs().add(2, 'hour').add(1, 'minute').toDate()
// const abc = dayjs().add(2, 'hour').add(1, 'minute').toDate()
// console.log(new Date())
