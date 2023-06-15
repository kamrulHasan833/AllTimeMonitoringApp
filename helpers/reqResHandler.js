/*
*
* Title: Request & Response handler
* Description: Request & response handler
* Author: Kamrul Hasan
* Date: 06/05/2023
*
*/

// Dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');
const { parseJson } = require('./utilities');
const data = require('../lib/data');

// Module Scaffolding
const handler = {};

// Configuration
handler.reqResHandler = (req, res) => {
  // Request Handler//
  // All request propertice
  const parseUrl = url.parse(req.url, true);
  const path = parseUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/, '');
  const method = req.method.toLowerCase();
  const queryStringObject = parseUrl.query;
  const headersObject = req.headers;
  const encoder = new StringDecoder('utf-8');
  const requestProperties = {
    parseUrl,
    trimmedPath,
    method,
    queryStringObject,
    headersObject,
  };
  const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;
  let realData = '';

  req.on('data', (buffer) => {
    realData += encoder.write(buffer);
  });
  req.on('end', () => {
    realData += encoder.end();

    // Add realData to requestProperties
    requestProperties.body = parseJson(realData);

    // Handle Response
    chosenHandler(requestProperties, (statusCode, payload) => {
      statusCode = typeof (statusCode) === 'number' ? statusCode : 500;
      payload = typeof (payload) === 'object' ? payload : {};
      const payloadString = JSON.stringify(payload);

      // return final response
      res.setHeader('Content-type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
};
module.exports = handler;
