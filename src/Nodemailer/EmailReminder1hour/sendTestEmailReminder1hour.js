const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')
const createTemplateContext = require('./createTemplateContext')
const { emailSubject } = require('./emailSubject.json')

const sendTestEmailReminder1hour = async (recipientEmail) => {
  const dummyCourseData = {
    name: 'Bazele HR si Testare',
    date: '15 Februarie 2022',
    hour: '18:30', 
    course_page: 'https://www.restart-camp.com/cursuri/social-media',
    logo: 'https://static.wixstatic.com/media/9a56fd_c46a6920a74e4b2a9e67604d8ac86527~mv2.png/v1/fill/w_205,h_206,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/transparent.png'
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
    template: 'emailReminder1hour',
    context: createTemplateContext(dummyCourseData)
  }
  
  return await transporter.sendMail(options)
}

module.exports = sendTestEmailReminder1hour
