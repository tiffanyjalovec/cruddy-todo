const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

//need to move this to a counter.txt file in the data folder
var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {//during invocation, we will pass in a error callback)
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData)); //callback will be writeCounter
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {

  readCounter (function(err, data) {
    if (err) {
      console.log('Error inside getNextUniqueId in readCounter');
    } else {
      writeCounter (data + 1, function(err, data) {
        if (err) {
          console.log('Error inside getNextUniqueId in writeCounter');
        } else {
          callback(null, data);
        }
      });
    }
  });
};

//exports.getNextUniqueId = (callback) => {
// readCounter (function(err, data) {
//   writeCounter (data +1, function(err, data) {
//     callback(null, data);
//   });
// });
//}

// counter = counter + 1;
// return zeroPaddedNumber(counter);


// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
