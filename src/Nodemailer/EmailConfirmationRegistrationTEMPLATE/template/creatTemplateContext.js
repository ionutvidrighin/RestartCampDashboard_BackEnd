//const breakStringAndAddCourseName = require('../helperMethods');
const replaceCharsInString = require('../helperMethods');
const BREAK_SYMBOL = '[break]'

function breakStringAndAddCourseName(string, courseName) {
  let stringToUpdate = string
  if (stringToUpdate.includes('{nume_curs}')) {
    stringToUpdate = stringToUpdate.replace('{nume_curs}', courseName)
  }

  const array = stringToUpdate.split(BREAK_SYMBOL)

  return array
}


function createTemplateContext(input) {
  const courseName = input.courseData.name
  const courseDate = input.courseData.date
  const courseHour = input.courseData.hour

  return {
    course: {
      name: input.courseData.name,
      logo: input.courseData.logo
    },
    topSection: {
      emailTitle: breakStringAndAddCourseName(input.topSection.emailTitle, courseName),
      subtitle: input.topSection.subtitle,
      paragraph: replaceCharsInString(input.topSection.paragraph, courseName, courseDate, courseHour)
    },
    centerSection: {
      row1: {
        title1: input.centerSection.row1.title1,
        paragraph1: replaceCharsInString(input.centerSection.row1.paragraph1, courseName, courseDate, courseHour),
        title2: input.centerSection.row1.title2,
        paragraph2: replaceCharsInString(input.centerSection.row1.paragraph2, courseName, courseDate, courseHour)
      },
      row2: {
        title1: input.centerSection.row2.title1,
        paragraph1: replaceCharsInString(input.centerSection.row2.paragraph1, courseName, courseDate, courseHour),
        title2: input.centerSection.row2.title2,
        paragraph2: replaceCharsInString(input.centerSection.row2.paragraph2, courseName, courseDate, courseHour),
        title3: input.centerSection.row2.title3,
        paragraph3: replaceCharsInString(input.centerSection.row2.paragraph3, courseName, courseDate, courseHour),
        title4: input.centerSection.row2.title4,
        paragraph4: replaceCharsInString(input.centerSection.row2.paragraph4, courseName, courseDate, courseHour)
      }
    },
    buttonsSection: {
      button1: {
        text: input.buttonsSection.button1.text,
        link: input.buttonsSection.button1.link
      },
      button2: {
        text: input.buttonsSection.button2.text,
        link: input.buttonsSection.button2.link
      }
    },
    contestLogoSection: input.contestLogoSection,
    contactSection: {
      title: input.contactSection.title,
      phone: input.contactSection.phone,
      email: input.contactSection.email,
      paragraph: input.contactSection.paragraph,
      aboutRestartCamp: {
        text: input.contactSection.aboutRestartCamp.text,
        link: input.contactSection.aboutRestartCamp.link
      }
    }
  }
}

module.exports = createTemplateContext