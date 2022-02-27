const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars');

 const sendConfirmationEmailAfterRegistration = async (input) => {

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
      partialsDir: path.resolve(__dirname, "views"),
      defaultLayout: false
    },
    viewPath: path.resolve(__dirname, "views"),
    extName: ".handlebars"
  }

  transporter.use("compile", hbs(handlebarOptions))
  
  let options = {
    from: '"RestartCamp  💌" <ionut-test1@outlook.com>', // sender address
    to: input.student_email,
    subject: `Datele de acces - cursuri gratuite Restart Camp`, 
    template: 'sevenDaysAfterRegistration',
    context: {
      nume_curs: input.course_name,
      data_curs: input.course_date,
      link_curs: 'https://www.restart-camp.ro'
    }
  }
  
  transporter.sendMail(options, (error, info) => {
    if (error) {
      console.log(error)
      return
    }
    console.log(info.response)
  })
 }


module.exports = sendConfirmationEmailAfterRegistration