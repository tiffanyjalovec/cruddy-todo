const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

//need to create separate txts files named with id # with todo text on line 1
var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId(( err, id) => {
    const filePath = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, { id: id, text: text });
      }
    });
  });
};

exports.readAll = (callback) => {
  //fs.readdir will return an array of filenames i.e. [00001.txt, 00002.txt, 00003.txt]
  fs.readdir(exports.dataDir, (err, itemFileNames) => {
    if (err) {
      callback(err);
    } else {
      var data = itemFileNames.map((item) => {
        return {id: item.slice(0, 5), text: item.slice(0, 5)};
      });
      callback(null, data);
    }
  });
  //take that array. map thru for each item. {id: item.slice(0,6), text: item.slice(0,6)}
};

//output: [{id: id, text: id}, {id: id, text: id}, {id: id, text: id}]

exports.readOne = (id, callback) => {
  const filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {id: id, text: data });//must get data.text to not be <BUFFER 45 67 67 73>
    }
  });
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};
//output: 'todo text';

exports.update = (id, text, callback) => {
  const filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, (err, oldText) => {
    if (err) {
      callback(Error(`ERROR: No item with ${id}`));
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, {id: id, text: text.toString()});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  const filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(filePath, (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
};

// var item = items[id];
// delete items[id];
// if (!item) {
//   // report an error if item not found
//   callback(new Error(`No item with id: ${id}`));
// } else {
//   callback();
// }


// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
