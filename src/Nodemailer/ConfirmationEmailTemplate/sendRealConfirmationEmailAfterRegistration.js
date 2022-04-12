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

module.exports = sendRealConfirmationEmailAfterRegistration


var cron = require('node-cron');

// cron.schedule('*/10 * * * * *', () => {
//   sendConfirmationEmailAfterRegistration(test)
// });

// const d = dayjs().add(2, 'hour').add(1, 'minute').toDate()
// const abc = dayjs().add(2, 'hour').add(1, 'minute').toDate()
// console.log(new Date())





