/*
*
* Title: AllTime Monitoring APP
* Description: A resful api to monitor up & down time of users defined links
* Version: 1.0.0
* Author: Kamrul Hasan
* Date: 06/05/2023
*
*/

// Dependencies
const server = require('./lib/sever');
const worker = require('./lib/worker');

// App Object- Module Scaffolding
const app = {};

// Iinit server and background workers
app.init = () => {
  // init server
  server.init();

  // // init worker
  worker.init();
};

app.init();
