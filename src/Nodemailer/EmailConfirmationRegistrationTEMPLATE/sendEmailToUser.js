const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars');
const dayjs = require('dayjs');

const sendRealConfirmationEmailAfterRegistration = async (input) => {

  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'ionut-test1@outlook.com', // generated ethereal user
      pass: 'IONUT123', // generated ethereal password
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
    from: '"RestartCamp  💌" <ionut-test1@outlook.com>', // sender address
    to: input.testEmail,
    subject: `Datele de acces - cursuri gratuite Restart Camp`,
    template: 'registrationConfirmation',
    context: {

    }
  }
  
  return await transporter.sendMail(options)
}

module.exports = sendRealConfirmationEmailAfterRegistration

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
