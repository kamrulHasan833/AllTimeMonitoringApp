/*
*
* Title: Uptime Monitoring Application
* Description: A Restful API to monitor up or down time of user defined links
* Athor: Kamrul Hasan
* Date: 03/06/2020
*

*/

// Dependencies
const http = require('http');
const { reqResHandler } = require('./helpers/reqResHandler');

// App Object - Module Scaffolding
const app = {};

// Configuration
app.config = {
  port: 3000,
};

// Create Server
app.createServer = () => {
  const server = http.createServer(app.reqResHandler);
  server.listen(app.config.port, () => {
    console.log(`Listening to port ${app.config.port}...`);
  });
};

// Request and Resposne Handler Function

app.reqResHandler = reqResHandler;

// Start the server
app.createServer();
