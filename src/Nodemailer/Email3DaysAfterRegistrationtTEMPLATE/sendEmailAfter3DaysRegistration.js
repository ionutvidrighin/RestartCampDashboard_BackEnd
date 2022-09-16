const faunaDB = require('faunadb')
const faunaClient = require('../../FaunaDataBase/faunaDB')
const collections = require('../../FaunaDataBase/collections')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')
const dayjs = require('dayjs')
const nodemailer = require('nodemailer')
const schedule = require('node-schedule')
const createTemplateContext = require('./template/createTemplateContext')
const studentType = require('../../constants/studentType')

const { Map, Paginate, Get, Collection, Documents, Lambda } = faunaDB.query;

module.exports = function sendScheduledEmail3DaysAfterRegistration(recipientEmail, registrationDate, typeOfStudent) {
  const threeDaysFromRegistrationDate = dayjs(registrationDate).add(3, 'days').format()
  
  schedule.scheduleJob(threeDaysFromRegistrationDate, async () => {
    sendEmail3DaysAfterRegistration(recipientEmail, typeOfStudent)
  
    console.log('==========E-MAIL SENDING==========')
    console.log('E-mail sent to ' + recipientEmail + ' on ' + dayjs().format())
  })
}

const sendEmail3DaysAfterRegistration = async (recipientEmail, typeOfStudent) => {
  const dbCollection = typeOfStudent === studentType.employee ? collections.EMAIL_3DAYS_EMPLOYEE : collections.EMAIL_3DAYS_COMPANY
  
  try {
    const rawEmailTemplate = await faunaClient.query(
      Map(
        Paginate(Documents(Collection(dbCollection))),
        Lambda(x => Get(x))
      )
    )
    const emailTemplate = rawEmailTemplate.data[0].data 
    
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
      subject: `Datele de acces - cursuri gratuite Restart Camp`,
      template: 'email3DaysAfterRegistration',
      context: createTemplateContext(emailTemplate)
    }

    transporter.verify(function (error, success) {
      if (error) {
        console.log(error)
      } else {
        console.log("Server is about to send *3DaysAfterRegistration* e-mail to " + recipientEmail)
      }
    })
    
    return await transporter.sendMail(options)

  } catch (error) {
    return error
  }
}

