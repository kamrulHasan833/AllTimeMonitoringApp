/*
*
* Title: Reques & Respose Handler
* Description: This module only for request and response handling
* Athor: Kamrul Hasan
* Date: 03/06/2020
*

*/

// Dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');

// Module Scaffolding
const handler = {};
handler.reqResHandler = (req, res) => {
  // Request handling
  // All needed variable to handle request
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimedPath = path.replace(/^\/+|\/+$/g, '');
  const method = req.method.toLowerCase();
  const queryString = parsedUrl.query;
  const { headers } = req;
  const decoder = new StringDecoder('utf-8');
  let realData = '';
  // Object of all request properties
  const reqProerties = {
    parsedUrl,
    path,
    trimedPath,
    method,
    queryString,
    headers,
  };
  const chosenHandler = routes[trimedPath] ? routes[trimedPath] : notFoundHandler;
  chosenHandler(reqProerties, (statusCode, payload) => {
    statusCode = typeof (statusCode) === 'number' ? statusCode : 500;
    payload = typeof (payload) === 'object' ? payload : {};
    const payloadString = JSON.stringify(payload);

    // Retun the final response
    res.writeHead(statusCode);
    res.end(payloadString);
  });

  req.on('data', (buffer) => {
    realData += decoder.write(buffer);
  });
  req.on('end', () => {
    realData += decoder.end();

    // Response Handling
    res.end('Hello node developers');
  });
};
module.exports = handler;
