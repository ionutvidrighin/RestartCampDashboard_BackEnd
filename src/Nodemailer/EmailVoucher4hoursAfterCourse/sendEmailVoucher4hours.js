const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')
const createTemplateContext = require('./createTemplateContext')
const { emailSubject } = require('./emailSubject.json')

module.exports = function sendScheduledEmailVoucher4hours(recipientEmail, courseStartDate) {
  // add 4 hours after course end
  const fourHoursAfterCourseEnd = dayjs(courseStartDate).add(4, 'hour').format()
  
  schedule.scheduleJob(fourHoursAfterCourseEnd, async () => {
    sendEmailVoucher4hours(recipientEmail)
  
    console.log('==========4Hours E-MAIL SENDING==========')
    console.log('E-mail sent to ' + recipientEmail + ' on ' + dayjs().format())
  })
}

const sendEmailVoucher4hours = async (recipientEmail, courseData) => {
  try {     
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
      subject: emailSubject,
      template: 'emailVoucher4hours',
      context: createTemplateContext(courseData)
    }
  
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error)
      } else {
        console.log("Server is about to send *4Hours Voucher Email*")
      }
    })

    return await transporter.sendMail(options)
  } catch (error) {
    return error
  }  
}

module.exports = sendEmailVoucher4hours
