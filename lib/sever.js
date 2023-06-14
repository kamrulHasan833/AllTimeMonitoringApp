/*
*
* Title: Server library
* Description: Server library contain server creating reatated code
* Author: Kamrul Hasan
* Date: 13/06/2023
*
*/

// Dependencies
const http = require('http');
const { reqResHandler } = require('../helpers/reqResHandler');
const environment = require('../helpers/environment');

// Server Object- Module Scaffolding
const server = {};

// Server is created here
server.createServer = () => {
  const createServerVar = http.createServer(server.reqResHandler);

  // Listen server
  createServerVar.listen(environment.port, () => {
    console.log(`Listening to prot ${environment.port}...`);
  });
};

// Request & Response handler
server.reqResHandler = reqResHandler;

// Server init function
server.init = () => {
  // Start server
  server.createServer();
};

// Export Module
module.exports = server;
