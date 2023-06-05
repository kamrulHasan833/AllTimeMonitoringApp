/*
*
* Title: Routes
* Description: Appication Routes
* Athor: Kamrul Hasan
* Date: 03/06/2020
*

*/

// Dependencies
const { aboutHandler } = require('./handlers/routeHandlers/aboutHandler');

// Module Scaffolding
const routes = {
  about: aboutHandler,
};
module.exports = routes;
