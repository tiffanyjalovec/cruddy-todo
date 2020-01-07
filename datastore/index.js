const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

//need to create separate txts files named with id # with todo text on line 1
var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id = counter.getNextUniqueId();
  var newFileName = id.toString() + '.txt';
  var newFile = path.join(exports.dataDir, newFileName);
  console.log('create', id, newFileName, newFile);
  // items[id] = text;
  //this adds to object which we don't want to do anymore.  we want to write a new file and put in data folder.
  fs.writeFile(newFile, text, (err) => {
    if (err) {
      throw ('error writing new item file');
    } else {
      callback(null, { id, text });
    }
  });
};

exports.readAll = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
