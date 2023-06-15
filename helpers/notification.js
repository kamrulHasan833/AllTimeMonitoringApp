/*
*
* Title: Notification
* Description: Sending notification to user to be known up or down time status of their defined link
* Author: Kamrul Hasan
* Date: 06/05/2023
*
*/

// Dependencies
const https = require('https');
const querystring = require('querystring');
const { twilio } = require('./environment');

// Module Scafolding
const notification = {};

// Sending sms to user using twilio api
notification.sendTwilioSms = (phone, sms, callback) => {
  // Input validation
  const userPhone = typeof (phone) === 'string' && phone.trim().length === 11 ? phone.trim() : false;
  const userMessg = typeof (sms) === 'string' && sms.trim().length >= 0 && sms.trim().length <= 1600 ? sms.trim() : false;

  if (userPhone && userMessg) {
    // Configuration twilio  object to request to send sms to user
    const payload = {
      from: twilio.from,
      to: `+88${userPhone}`,
      body: userMessg,
    };
    // Stringify payload
    const stringifyPayload = querystring.stringify(payload);

    // Https request object to twilio
    const requestObject = {
      protocol: 'https:',
      hostname: 'api.twilio.com',
      path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
      method: 'POST',
      auth: `${twilio.accountSid}:${twilio.authToken}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const req = https.request(requestObject, (res) => {
      const status = res.statusCode;
      if (status === 200 || status === 201) {
        callback(false);
      } else {
        callback(`Status code returned was ${status}`);
      }
    });
    req.on('error', (err) => {
      console.log(err);
    });
    req.write(stringifyPayload);
    req.end();
  } else {
    callback('Error! There was a problem for missing input.');
  }
};
module.exports = notification;
