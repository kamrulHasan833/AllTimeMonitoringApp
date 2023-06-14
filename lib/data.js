/*
*
* Title: CRUD Operation
* Description: Data wirte, read, upadate and delete
* Author: Kamrul Hasan
* Date: 06/06/2023
*
*/

// Dependencies
const path = require('path');
const fs = require('fs');
// Module scafolding
const data = {};

// Base directory of data folder
data.basedir = path.join(__dirname, '../.data');

// Write data to new file
data.create = (dir, file, dataToWrite, callback) => {
// Open file here
  fs.open(`${data.basedir}/${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Conver dat to json string
      const stringData = JSON.stringify(dataToWrite);

      // Finally write data here
      fs.writeFile(fileDescriptor, stringData, (err2) => {
        if (!err2) {
          fs.close(fileDescriptor, (err3) => {
            if (!err3) {
              callback(false);
            } else {
              callback("Error! Data cann't be created and the file cann't be closed.");
            }
          });
        } else {
          callback('An error occured to write data');
        }
      });
    } else {
      callback("Couldn't create new file to read data. This file may exists!");
    }
  });
};

// Read data from file
data.read = (dir, file, callback) => {
  fs.readFile(`${data.basedir}/${dir}/${file}.json`, 'utf-8', (err, dataToRead) => {
    callback(err, dataToRead);
  });
};

// Update the existing data file
data.update = (dir, file, dataToUpdate, callback) => {
  fs.open(`${data.basedir}/${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Covert data to json data
      const stringData = JSON.stringify(dataToUpdate);

      // File trucate and update
      fs.ftruncate(fileDescriptor, (err2) => {
        if (!err2) {
          fs.writeFile(fileDescriptor, stringData, (err3) => {
            if (!err3) {
              fs.close(fileDescriptor, (err4) => {
                if (!err4) {
                  callback(false);
                } else {
                  callback("Error! File couldn'd be closed.");
                }
              });
            } else {
              callback("Error! File couldn't be updated.");
            }
          });
        } else {
          callback("Error! File couldn'truncate.");
        }
      });
    } else {
      callback("Error! File couldn't be updated.");
    }
  });
};

// Delete the existing data file
data.deleteFile = (dir, file, callback) => {
  fs.unlink(`${data.basedir}/${dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("Error! Data file isn't deleted.");
    }
  });
};

// Make a list of data files
data.list = (dir, callback) => {
  fs.readdir(`${data.basedir}/${dir}/`, (err, fileList) => {
    if (!err && fileList.length > 0) {
      const trimmedFileList = [];
      fileList.forEach((file) => trimmedFileList.push(file.replace('.json', '')));
      callback(false, trimmedFileList);
    } else {
      callback('Error! There was no files.', []);
    }
  });
};
module.exports = data;
