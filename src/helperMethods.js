const dayjs = require('dayjs')
const localizedFormat = require('dayjs/plugin/localizedFormat')
const localeRO = require('dayjs/locale/ro')
dayjs.extend(localizedFormat)

const replaceTextInString = (data, newData) => {
  let convertToArray = Object.entries(data)

  convertToArray.map(element => {
    if (element[1].search("{nume_curs}") != -1) {
      element[1] = element[1].replace("{nume_curs}", newData.name)
      element[1] = element[1].replace("{data_curs}", dayjs(newData.date).locale(localeRO).format('LL'))
      element[1] = element[1].replace("{ora_curs}", newData.hour)
      return element
    }
  })

  let convertToObject = {}
  convertToArray.forEach(element => {
    Object.assign(convertToObject, {
      [element[0]]: element[1]
    })
  })

  return convertToObject

}

module.exports = replaceTextInString