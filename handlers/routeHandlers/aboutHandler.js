/*
*
* Title: About Route
* Description: About Route Handler
* Athor: Kamrul Hasan
* Date: 03/06/2020
*

*/

// Module Scaffolding
const handler = {};

handler.aboutHandler = (reqProerties, callback) => {
  console.log(reqProerties);

  callback(200, {
    message: 'This is the about url',
  });
};

module.exports = handler;
