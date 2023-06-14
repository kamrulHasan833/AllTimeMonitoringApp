/*
*
* Title: Routes
* Description: Routes handler
* Author: Kamrul Hasan
* Date: 06/05/2023
*
*/

// Dependencies
const { aboutHandler } = require('./handlers/routeHandlers/aboutHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler');
const { checkHandler } = require('./handlers/routeHandlers/checkHandler');

// Module Scaffolding
const routes = {
  about: aboutHandler,
  user: userHandler,
  token: tokenHandler,
  check: checkHandler,
};
module.exports = routes;
