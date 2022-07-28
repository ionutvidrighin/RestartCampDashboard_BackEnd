
const replaceCharsInString = (string, wordsToAdd) => {
  
  let spreadString = string.split('[link]')
  spreadString = spreadString.slice(0, -1)

  const wordsReplaced = []
  for (let i = 0; i < spreadString.length; i++) {
    wordsReplaced.push(spreadString[i] + " " + wordsToAdd[i])
  }

  return wordsReplaced.join('')
}


module.exports.replaceCharsInString = replaceCharsInString;
