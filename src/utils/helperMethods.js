const dayjs = require('dayjs')
const localizedFormat = require('dayjs/plugin/localizedFormat')
const localeRO = require('dayjs/locale/ro')
dayjs.extend(localizedFormat)

const replaceTextInString = (data, newData) => {
  const convertToArray = Object.entries(data)

  convertToArray.map(element => {
    if (element[1].search("{nume_curs}") != -1) {
      element[1] = element[1].replace("{nume_curs}", newData.name)
    }
    if (element[1].search("{data_curs}") != -1) {
      element[1] = element[1].replace("{data_curs}", dayjs(newData.date).locale(localeRO).format('LL'))
    }
    if (element[1].search("{ora_curs}") != -1) {
      element[1] = element[1].replace("{ora_curs}", newData.hour)
    }
    return element
  })

  const convertToObject = {}
  convertToArray.forEach(element => {
    Object.assign(convertToObject, {
      [element[0]]: element[1]
    })
  })

  return convertToObject

}

const addLinkToButtons = (data, course_link_page) => {
  const links = []
  const texts = []
  const convertToObject = {}
  const convertToArray = Object.entries(data)

  // insert the course link page into the String
  convertToArray.map(string => {
    if (string[1].search('{link_pagina_curs}') != -1) {
      string[1] = string[1].replace('{link_pagina_curs}', `{${course_link_page}}`)
      return string
    }
  })

  // extract the Links out of the Strings
  convertToArray.forEach(string => {
    if (string[1].includes('{')) {
      const divided = string[1].split('{')
      const finalLink = divided[1].slice(0, -1)
      links.push(finalLink)
    }
  })

  // clean up the Strings by removing the Links
  convertToArray.forEach(element => {
    const index = element[1].indexOf('{')
    const finalString = element[1].slice(0, index)
    texts.push(finalString)
  })

  // convert to Object and return
  convertToArray.forEach((element, i) => {
    Object.assign(convertToObject, {
      [element[0]]: {
        text: texts[i],
        link: links[i]
      }
    })
  })

  return convertToObject

}

const renameKeysInObject = (object, newKeys) => {
  const keyValues = Object.keys(object).map(key => {
    const newKey = newKeys[key] || key
    return { [newKey]: object[key] }
  })
  return Object.assign({}, ...keyValues)
}

const preparePhoneNumbersWhatsappFormat = (data) => {
  const entriesList = []
  data.forEach(entry => {
    const formattedPhoneCode = entry.phoneCode.substring(1)
    const formattedPhoneNo = entry.phoneNo.charAt(0) === '0' ? entry.phoneNo.substring(1) : entry.phoneNo

    const phoneNo = `A,${formattedPhoneCode}${formattedPhoneNo}`
    const courseName = entry.courseName[0].title
    const registrationDate = entry.registrationDate
    entriesList.push({registrationDate, phoneNo, courseName, })
  })

  return entriesList
}

module.exports = {
  replaceTextInString,
  addLinkToButtons,
  renameKeysInObject,
  preparePhoneNumbersWhatsappFormat
}