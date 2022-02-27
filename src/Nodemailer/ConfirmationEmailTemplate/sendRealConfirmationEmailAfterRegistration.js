const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars');
const dayjs = require('dayjs');

const sendRealConfirmationEmailAfterRegistration = async (input) => {

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
      course_logo: input.courseData.courseLogo,
      course_date: input.courseData.courseDate,
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

module.exports = sendRealConfirmationEmailAfterRegistration


var cron = require('node-cron');

// cron.schedule('*/10 * * * * *', () => {
//   sendConfirmationEmailAfterRegistration(test)
// });

// const d = dayjs().add(2, 'hour').add(1, 'minute').toDate()
// const abc = dayjs().add(2, 'hour').add(1, 'minute').toDate()
// console.log(new Date())





