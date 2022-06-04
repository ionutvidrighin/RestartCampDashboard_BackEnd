const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars');
const dayjs = require('dayjs');
const replaceTextInString = require('../../helperMethods').replaceTextInString
const addLinkToButtons = require('../../helperMethods').addLinkToButtons

const sendConfirmationEmailAfterRegistration = async (input) => {

  const { sectionTop, sectionCenter, contestLogoLink, contactSection } = input.emailTemplate
  const courseData = {
    name: input.course_name,
    date: input.course_date,
    hour: `${dayjs(input.course_date).hour()}:${dayjs(input.course_date).minute()}`,
    link_page: input.course_link_page
  } 
  const replacedTextSectionTop = replaceTextInString(sectionTop, courseData)
  const replacedTextSectionCenter = replaceTextInString(sectionCenter, courseData)

  const buttonsRawData = {
    button1: sectionCenter.button1,
    button2: sectionCenter.button2
  }
  const linksOnButtons = addLinkToButtons(buttonsRawData, courseData.link_page) 

  let transporter = nodemailer.createTransport({
    host: "smtp.ionos.co.uk",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'echipa@restart-camp.org', // generated ethereal user
      pass: 'Crestere312', // generated ethereal password
    }
    // host: "smtp-mail.outlook.com",
    // port: 587,
    // secure: false, // true for 465, false for other ports
    // auth: {
    //   user: 'restart-camp-t@outlook.com', // generated ethereal user
    //   pass: 'IONUT123', // generated ethereal password
    // }
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
    to: input.student_email,
    subject: `Datele de acces - cursuri gratuite Restart Camp`,
    template: 'registrationConfirmation',
    context: {
      course: {
        name: input.course_name,
        logo: input.course_logo
      },
      sectionTop: {
        title: replacedTextSectionTop.title,
        paragraph: replacedTextSectionTop.paragraph,
        subtitle1: replacedTextSectionTop.subtitle1,
        paragraph1: replacedTextSectionTop.paragraph1,
        subtitle2: replacedTextSectionTop.subtitle2,
        paragraph2: replacedTextSectionTop.paragraph2
      },
      sectionCenter: {
        title1: replacedTextSectionCenter.title1,
        paragraph1: replacedTextSectionCenter.paragraph1,
        title2: replacedTextSectionCenter.title2,
        paragraph2: replacedTextSectionCenter.paragraph2,
        title3: replacedTextSectionCenter.title3,
        paragraph3: replacedTextSectionCenter.paragraph3,
        title4: replacedTextSectionCenter.title4,
        paragraph4: replacedTextSectionCenter.paragraph4,
        button1: {
          text: linksOnButtons.button1.text,
          link: linksOnButtons.button1.link
        },
        button2: {
          text: linksOnButtons.button2.text,
          link: linksOnButtons.button2.link
        }
      },
      contestLogoLink: contestLogoLink,
      contactSection: {
        phone: contactSection.phone,
        email: contactSection.email
      }
    }
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

module.exports = sendConfirmationEmailAfterRegistration

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
