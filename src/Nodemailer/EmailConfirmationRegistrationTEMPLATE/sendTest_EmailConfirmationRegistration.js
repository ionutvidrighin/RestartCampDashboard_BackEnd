const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')
const replaceTextInString = require('../../helperMethods').replaceTextInString
const addLinkToButtons = require('../../helperMethods').addLinkToButtons

const sendTest_EmailConfirmationRegistration = async (input) => {
  const { sectionTop, sectionCenter, contestLogoLink, contactSection } = input
  Object.assign(input, {
    courseData: {
      name: 'CURS TEST, CURS TEST',
      date: '15 Februarie 2022',
      hour: '18:30', 
      link_page: 'https://www.restart-camp.com/cursuri/social-media',
      logo: 'https://static.wixstatic.com/media/9a56fd_c46a6920a74e4b2a9e67604d8ac86527~mv2.png/v1/fill/w_205,h_206,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/transparent.png'
    }
  })

  const replacedTextSectionTop = replaceTextInString(sectionTop, input.courseData)
  const replacedTextSectionCenter = replaceTextInString(sectionCenter, input.courseData)
  const buttonsRawData = {
    button1: sectionCenter.button1,
    button2: sectionCenter.button2
  }
  const linksOnButtons = addLinkToButtons(buttonsRawData, input.courseData.link_page) 

  let transporter = nodemailer.createTransport({
    host: "smtp.ionos.co.uk",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'echipa@restart-camp.org', // generated ethereal user
      pass: 'Crestere312', // generated ethereal password
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
    to: input.testEmail,
    subject: `Datele de acces - cursuri gratuite Restart Camp`,
    template: 'registrationConfirmation',
    context: {
      course: {
        name: input.courseData.name,
        logo: input.courseData.logo
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
  
  return await transporter.sendMail(options)
}

module.exports = sendTest_EmailConfirmationRegistration




