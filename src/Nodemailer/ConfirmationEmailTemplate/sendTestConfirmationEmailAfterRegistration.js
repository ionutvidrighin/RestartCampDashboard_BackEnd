const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')

const sendTestConfirmationEmailAfterRegistration = async (input) => {

  Object.assign(input, {
    courseData: {
      courseName: 'Bazele GDPR & Securitatea Informației',
      courseDate: '20 Februarie 2022',
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
    template: input.testEmail.includes('@gmail') ? 'registrationConfirmationGmail' : 'registrationConfirmationOthers',
    context: {
      /* course data */
      course_name: input.courseData.courseName,
      course_logo: input.courseData.courseLogo,
      course_date: input.courseData.courseDate,
      course_access_link: input.courseData.courseAccessLink,
      /* subtitle section */
      subtitle_section_subtitle_title: input.subtitleSection.subtitle.title,
      subtitle_section_subtitle_paragraph: input.subtitleSection.subtitle.paragraph,
      subtitle_section_paragraph_title: input.subtitleSection.paragraph.title,
      subtitle_section_paragraph_paragraph: input.subtitleSection.paragraph.paragraph,
      /* section center */
      section_center_title1: input.sectionCenter.subsectionOne.title1,
      section_center_paragraph1: input.sectionCenter.subsectionOne.paragraph1,
      section_center_title2: input.sectionCenter.subsectionOne.title2,
      section_center_paragraph2: input.sectionCenter.subsectionOne.paragraph2,
      section_center_title3: input.sectionCenter.subsectionTwo.title1,
      section_center_paragraph3: input.sectionCenter.subsectionTwo.paragraph1,
      section_center_title4: input.sectionCenter.subsectionTwo.title2,
      section_center_paragraph4: input.sectionCenter.subsectionTwo.paragraph2,
      section_center_button1: input.sectionCenter.button1,
      section_center_button2: input.sectionCenter.button2,
      /* contact section */
      restart_camp_phone_number: input.contactSection.phone_number,
      restart_camp_email: input.contactSection.email
    }
  }
  
  return await transporter.sendMail(options)
}

module.exports = sendTestConfirmationEmailAfterRegistration




