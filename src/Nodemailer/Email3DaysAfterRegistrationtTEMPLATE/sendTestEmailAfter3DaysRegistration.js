const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')
const createTemplateContext = require('./template/createTemplateContext');

const sendTestEmail3DaysAfterRegistration = async (recipientEmail, emailTemplate) => {

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
    from: '"RestartCamp" <echipa@restart-camp.org>', // sender Email address
    to: recipientEmail, // recipient Email address
    subject: `Tu de unde esti ? -Restart Camp-`,
    template: 'email3DaysAfterRegistration',
    context: createTemplateContext(emailTemplate)
  }

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error)
    } else {
      console.log("Server is ready to send test e-mail")
      console.log('E-mail successfully sent to ' + recipientEmail + ' === ' + success)
    }
  })
  
  return await transporter.sendMail(options)
}

module.exports = sendTestEmail3DaysAfterRegistration




