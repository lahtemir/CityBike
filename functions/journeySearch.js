function journeySearch(userInput, value, factor) {
  let output;
  if(isNaN(userInput)) {
   return ;
  } else if (!userInput) {
    output = parseFloat(value)
  } else {
    output = parseFloat(userInput)*factor
  }
  return output;
};



module.exports = { journeySearch };