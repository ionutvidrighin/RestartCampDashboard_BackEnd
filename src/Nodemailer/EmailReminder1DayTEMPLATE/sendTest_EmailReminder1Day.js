const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')

const sendTest_EmailReminder7Days = async (input) => {

  let button1;
  let button2;
  if (input.sectionReferral.button1.includes('-') || input.sectionReferral.button2.includes('-')) {
    button1 = input.sectionReferral.button1.split('-')
    button2 = input.sectionReferral.button2.split('-')
  }

  Object.assign(input, {
    courseData: {
      courseName: 'Bazele GDPR & Securitatea Informației',
      courseDate: '20 Iunie 2022',
      courseAccessLink: 'https://www.restart-camp.com/cursuri/gdpr-securitatea-informatiei?utm_campaign=c103a99a-e17e-4cc2-8b44-7516ac55a4ac&utm_source=so&utm_medium=mail&utm_content=5c00c386-4bd1-4e93-9262-0391d8df627d',
      courseLogo: 'https://ci4.googleusercontent.com/proxy/jdxrO5FtHYEtqSgk8GUJRDYV0hxj6wwnSRDWPqDUpq4ZdfD9s1EhwnzoJaneT2y5aKp9Vy5aHPewpiWtu_ddc0HGqaJEt2WN5IM1w_D-cQ-1AhV-E6RWpnEArO3KbHqM_Q9svunP5C2V4CfjQVpGGxwRjrNq5RiQKhs_2rsM1BVzJWl7XMuMrlx3fqwsl_pcM4L4xSNRRolfedhgnODdjq_EkWHNsoQJCLHexL2U9Z57UhKV=s0-d-e1-ft#https://static.wixstatic.com/media/9a56fd_c800aed3905046be9facad444d56e356~mv2.png/v1/fit/w_700,h_2000,al_c,q_85/9a56fd_c800aed3905046be9facad444d56e356~mv2.png'
    }
  })

  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'restart-camp-t@outlook.com', // generated ethereal user
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
    from: '"RestartCamp  💌" <restart-camp-t@outlook.com>', // sender address
    to: input.testEmail,
    subject: `Datele de acces - cursuri gratuite Restart Camp`,
    template: 'emailReminder1Day',
    context: {
      course: {
        name: input.courseData.courseName,
        logo: input.courseData.courseLogo,
        date: input.courseData.courseDate,
        access_link: input.courseData.courseAccessLink
      },
      logoSection: input.logoSection,
      sectionCenter: {
        title1: input.sectionCenter.title1,
        paragraph1: input.sectionCenter.paragraph1,
        title2: input.sectionCenter.title2,
        paragraph2: input.sectionCenter.paragraph2,
        title3: input.sectionCenter.title3,
        paragraph3: input.sectionCenter.paragraph3,
        title4: input.sectionCenter.title4,
        paragraph4: input.sectionCenter.paragraph4,
      },
      sectionReferral: {
        button1Text: button1[0].trim(),
        button1Link: button1[1].trim(),
        button2Text: button2[0].trim(),
        button2Link: button2[1].trim(),
        logo: input.sectionReferral.logo,
        text: input.sectionReferral.text
      },
      contactSection: {
        phone: input.contactSection.phone,
        email: input.contactSection.email
      }
    }
  }
  
  return await transporter.sendMail(options)
}

module.exports = sendTest_EmailReminder7Days




