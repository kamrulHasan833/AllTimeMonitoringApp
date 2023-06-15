/*
*
* Title: Worker library
* Description: Worker library contain background worker reatated code
* Author: Kamrul Hasan
* Date: 13/06/2023
*
*/

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const data = require('./data');
const { parseJson } = require('../helpers/utilities');
const notification = require('../helpers/notification');

// Worker Object- Module Scaffolding
const worker = {};

// Find out all the chek
worker.gatherAllCheck = () => {
  data.list('checks', (err, checks) => {
    if (!err && checks.length > 0) {
      checks.forEach((check) => {
        data.read('checks', check, (err2, checkData) => {
          if (!err2 && checkData) {
          // Pass check data to the check validator
            worker.validateCheckData(parseJson(checkData));
          } else {
            console.log('Error! There is no checkData');
          }
        });
      });
    } else {
      console.log('Error! No check to gather  ');
    }
  });
};

// Validate check data
worker.validateCheckData = (checkData) => {
  const originCeckData = checkData;

  if (checkData && checkData.checkId) {
    // Validate state in check data
    originCeckData.state = typeof (originCeckData.state) === 'string' && ['up', 'down'].indexOf(originCeckData.state) > -1 ? originCeckData.state : 'down';

    // Validate last check time
    originCeckData.lastCheck = typeof (originCeckData.lastCheck) === 'number' && originCeckData.lastCheck > 0 ? originCeckData.lastCheck : false;
    // Pass check data to the next process
    worker.performCheck(originCeckData);
  } else {
    console.log('Error! No check to validate.');
  }
};

// Perform check data
worker.performCheck = (originCheckData) => {
  // Prepare the initial check outcome
  let checkOutcome = {
    error: false,
    responseCode: false,
  };

  // Mark check outcome has been send yet
  let outcomeSent = false;

  // Parse url from original chek data
  const parsedUrl = url.parse(`${originCheckData.protocol}://${originCheckData.url}`, true);
  const { hostname } = parsedUrl;
  const { path } = parsedUrl;

  //

  // Request object
  const requestObject = {
    protocol: `${originCheckData.protocol}:`,
    hostname,
    method: originCheckData.method.toUpperCase(),
    path,
    timeout: originCheckData.timeoutSecond * 1000,

  };

  // Select the correct protocol
  const protocolToUse = originCheckData.protocol === 'http' ? http : https;

  // Construck Request
  const req = protocolToUse.request(requestObject, (res) => {
    // Grab the status code
    const status = res.statusCode;

    // Update the check outcome and pass to next process
    checkOutcome.responseCode = status;

    if (!outcomeSent) {
      worker.processCheckOutcome(originCheckData, checkOutcome);
      // eslint-disable-next-line no-const-assign
      outcomeSent = true;
    }
  });
  req.on('error', (err) => {
    checkOutcome = {

      error: true,
      value: err,
    };
    // Update the check outcome and pass to next process
    if (!outcomeSent) {
      worker.processCheckOutcome(originCheckData, checkOutcome);
      // eslint-disable-next-line no-const-assign
      outcomeSent = true;
    }
  });

  req.on('timeout', () => {
    checkOutcome = {

      error: true,
      value: 'timeout',
    };
    // Update the check outcome and pass to next process
    if (!outcomeSent) {
      worker.processCheckOutcome(originCheckData, checkOutcome);
      // eslint-disable-next-line no-const-assign
      outcomeSent = true;
    }
  });
  req.end();
};

// Save check outcome to databse and to nex process
worker.processCheckOutcome = (originCheckData, checkOutcome) => {
  // check if chek outcome is up or down
  const state = !checkOutcome.error && checkOutcome.responseCode && originCheckData.successCode.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';

  // Decide whether we should alert the user or not
  const alertWanted = !!(originCheckData.lastCheck && originCheckData.state !== state);

  // Varriable for check data
  const finalCheckData = originCheckData;

  // Update Check data
  finalCheckData.state = state;
  finalCheckData.lastCheck = Date.now();

  data.update('checks', finalCheckData.checkId, finalCheckData, (err) => {
    if (!err) {
      if (alertWanted) {
        // Pass the check data to next process
        worker.sentAlertSms(finalCheckData);
      } else {
        console.log('Alert is not needed as no state change');
      }
    } else {
      console.log('Error! Check was not updated.');
    }
  });
};

// Send alert sms to user for state changing
worker.sentAlertSms = (finalCheckData) => {
  // message variable
  const messg = `Alert! Your check for ${finalCheckData.method.toUpperCase()} ${finalCheckData.protocol}://${finalCheckData.url} is currently ${finalCheckData.state}.`;
  notification.sendTwilioSms(finalCheckData.phone, messg, (err) => {
    if (!err) {
      console.log(`User was alerted to a status change via SMS: ${messg}`);
    } else {
      console.log(err);
      console.log('There was problem to send alert to user.');
    }
  });
};

// Timer to execute the worker process once per minute
worker.loop = () => {
  setInterval(() => {
    worker.gatherAllCheck();
  }, 10000);
};

// Server init function
worker.init = () => {
  // Gather all check
  worker.gatherAllCheck();

  // Call the loop so that checks continue
  worker.loop();
};

// Export Module
module.exports = worker;
