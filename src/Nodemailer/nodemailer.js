const nodemailer = require('nodemailer')

const sendConfirmationEmail = (email) => {

  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'ionut-test1@outlook.com', // generated ethereal user
      pass: 'IONUT123', // generated ethereal password
    }
  })
  
  let options = {
    from: '"RestartCamp  💌" <ionut-test1@outlook.com>', // sender address
    to: [email], // list of receivers
    // bcc: addresses,
    subject: "Hello from Restart Camp - Test ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<b>Hello world?</b>`, // html body
  }
  
  transporter.sendMail(options, (error, info) => {
    if (error) {
      console.log(error)
      return
    }
    console.log(info.response)
  })
}

module.exports = sendConfirmationEmail