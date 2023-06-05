/*
*
* Title: 404 Route
* Description: 404 Route Handler
* Athor: Kamrul Hasan
* Date: 03/06/2020
*

*/

// Module Scaffolding
const handler = {};

handler.notFoundHandler = (reqProperties, callback) => {
  console.log(reqProperties);
  callback(404, {
    message: 'Your requested URL was not found!',
  });
};

module.exports = handler;
