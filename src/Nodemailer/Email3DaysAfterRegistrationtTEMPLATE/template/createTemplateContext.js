//const breakStringAndAddCourseName = require('../helperMethods');
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
  return {
    topSection: {
      templateLogo: input.topSection.templateLogo,
      emailTitle: breakStringAndAddCourseName(input.topSection.emailTitle),
      paragraph: input.topSection.paragraph
    },
    centerSection: {
      logoLink: input.centerSection.logoLink,
      title: input.centerSection.title,
      paragraph: input.centerSection.paragraph,
      title2: input.centerSection.title2
    },
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