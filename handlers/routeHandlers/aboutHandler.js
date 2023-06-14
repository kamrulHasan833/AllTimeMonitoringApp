/*
*
* Title: About Route
* Description: About route handler
* Author: Kamrul Hasan
* Date: 06/05/2023
*
*/

// Module Scaffolding
const handler = {};

handler.aboutHandler = (requestProperties, callback) => {
  callback(200, {
    message: 'This is about url',
  });
};

module.exports = handler;
