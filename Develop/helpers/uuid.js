// Immediately export a function that generates a string of random numbers and letters
// Results in a unique identifier for each note that is added 
// Can use as a property to call on 
module.exports = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
