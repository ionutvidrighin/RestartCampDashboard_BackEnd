const nodemailer = require('nodemailer')

const sendConfirmationEmailAfterRegistration = (email, courseId) => {

  const emailConfirmationTemplate = `
  <h1>Hello , this is an H1 tag</h1>
  <strong>this is strong</strong>
  <p>this is the e-mail address: ${email}</p>
  <img src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"/>
  <p>This is the course ID: ${courseId}</p>
` 

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
    to: email, // list of receivers
    // bcc: addresses,
    subject: "Hello from Restart Camp - Test ✔", // Subject line
    html: emailConfirmationTemplate, // html body
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