const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')

const sendTestConfirmationEmailAfterRegistration = async (input) => {
  Object.assign(input, {
    courseData: {
      courseName: 'Bazele GDPR & Securitatea Informației',
      courseDate: '20 Februarie 2022',
      courseAccessLink: 'https://www.restart-camp.com/cursuri/gdpr-securitatea-informatiei?utm_campaign=c103a99a-e17e-4cc2-8b44-7516ac55a4ac&utm_source=so&utm_medium=mail&utm_content=5c00c386-4bd1-4e93-9262-0391d8df627d',
      courseLogo: 'https://res.cloudinary.com/drr6nvfqj/image/upload/v1644861159/restartcamp/course-logo_hxylxr.png'
    }
  })

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
      partialsDir: path.resolve(__dirname, "template"),
      defaultLayout: false
    },
    viewPath: path.resolve(__dirname, "template"),
    extName: ".handlebars"
  }

  transporter.use("compile", hbs(handlebarOptions))
  
  let options = {
    from: '"RestartCamp  💌" <ionut-test1@outlook.com>', // sender address
    to: input.testEmail,
    subject: `Datele de acces - cursuri gratuite Restart Camp`,
    template: 'registrationConfirmation',
    context: {
      /* course data */
      course_name: input.courseData.courseName,
      course_date: input.courseData.courseDate,
      course_logo: input.courseData.courseLogo,
      course_access_link: input.courseData.courseAccessLink,
      /* subtitle section */
      subtitle_section_title: input.subtitleSection.title,
      subtitle_section_paragraph: input.subtitleSection.paragraph,
      /* section one */
      section_1_title1: input.sectionOne.title1,
      section_1_title2: input.sectionOne.title2,
      section_1_paragraph2: input.sectionOne.paragraph2,
      /* section two */
      section_2_title1: input.sectionTwo.subsectionOne.title1,
      section_2_paragraph1: input.sectionTwo.subsectionOne.paragraph1,
      section_2_title2: input.sectionTwo.subsectionOne.title2,
      section_2_paragraph2: input.sectionTwo.subsectionOne.paragraph2,
      section_2_title3: input.sectionTwo.subsectionTwo.title1,
      section_2_paragraph3: input.sectionTwo.subsectionTwo.paragraph1,
      section_2_title4: input.sectionTwo.subsectionTwo.title2,
      section_2_paragraph4: input.sectionTwo.subsectionTwo.paragraph2,
      /* contact section */
      restart_camp_phone_number: input.contactSection.phone_number,
      restart_camp_email: input.contactSection.email
    }
  }
  
  return await transporter.sendMail(options)
}

module.exports = sendTestConfirmationEmailAfterRegistration




