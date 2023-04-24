function journeySearch(userInput, value, factor) {
  let output;
  if (!userInput) {
    output = parseFloat(value)
  } else {
    output = parseFloat(userInput)*factor
  }
  return output;
};



module.exports = { journeySearch };