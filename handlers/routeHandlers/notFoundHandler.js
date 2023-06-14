/*
*
* Title: 404 Route
* Description: 404 page handler
* Author: Kamrul Hasan
* Date: 06/05/2023
*
*/

// Module Scaffolding
const handler = {};

handler.notFoundHandler = (requesProperties, callback) => {
  callback(404, {
    message: 'Your requested URL was not found',
  });
};

module.exports = handler;
