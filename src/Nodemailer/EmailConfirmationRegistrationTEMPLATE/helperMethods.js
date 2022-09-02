module.exports = function replaceCharsInString (string, courseName, courseDate, courseHour) {
  let sentence = string
  if (sentence.includes('{nume_curs}')) {
    sentence = sentence.replace('{nume_curs}', courseName)
  }

  if (sentence.includes('{data_curs}')) {
    sentence = sentence.replace('{data_curs}', courseDate)
  }

  if (sentence.includes('{ora_curs}')) {
    sentence = sentence.replace('{ora_curs}', courseHour)
  }

  return sentence
}
