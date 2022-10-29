const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')
const createTemplateContext = require('./createTemplateContext')
const { emailSubject } = require('./emailSubject.json')

const sendTestEmailVoucher4hours = async (recipientEmail) => {
  const dummyCourseData = {
    name: 'Bazele HR si Testare'
}

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
    from: '"RestartCamp" <echipa@restart-camp.org>', // sender address
    to: recipientEmail,
    subject: emailSubject,
    template: 'emailVoucher4hours',
    context: createTemplateContext(dummyCourseData)
  }
  
  return await transporter.sendMail(options)
}

module.exports = sendTestEmailVoucher4hours




