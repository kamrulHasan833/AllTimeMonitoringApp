/*
*
* Title: User Route
* Description: Handler to handle user route
* Author: Kamrul Hasan
* Date: 06/06/2023
*
*/

// Dependencies
const data = require('../../lib/data');
const { parseJson } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

// Module Scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const methodValidation = ['post', 'get', 'put', 'delete'];

  if (methodValidation.indexOf(requestProperties.method) > -1) {
    handler._user[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, {
      error: 'Error! Your requested method is invalid.',
    });
  }
};

handler._user = {};

// Create new user
handler._user.post = (requestProperties, callback) => {
  const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

  const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

  const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

  const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
  const tocAgree = typeof (requestProperties.body.tocAgree) === 'boolean' ? requestProperties.body.tocAgree : false;
  if (firstName && lastName && phone && password && tocAgree) {
    const userObject = {
      firstName,
      lastName,
      phone,
      password,
      tocAgree,
    };
    data.create('users', phone, userObject, (err) => {
      if (!err) {
        callback(200, {
          success: 'Success! you have abled to crate an user.',
        });
      } else {
        callback(400, {
          error: 'Error! You have created an user accound with same phone number.',
        });
        console.log(err);
      }
    });
  } else {
    callback(400, {
      error: "Error! You couldn't request sucessfully, some fields missing.",
    });
  }
};

// Read user
handler._user.get = (requestProperties, callback) => {
  const phone = typeof (requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
  const tokenId = typeof (requestProperties.headersObject.token) === 'string' && requestProperties.headersObject.token.trim().length === 20 ? requestProperties.headersObject.token : false;
  if (phone) {
    tokenHandler._token.verify(tokenId, phone, (token) => {
      if (token) {
        data.read('users', phone, (err, u) => {
          // Conver json string to js variable
          const user = { ...parseJson(u) };
          if (!err) {
            delete user.password;
            delete user.tocAgree;
            callback(200, user);
          } else {
            callback(404, {
              error: '404 Error! Page not found.',
            });
          }
        });
      } else {
        callback(403, {
          error: 'Error! There was an authentication problem.',
        });
      }
    });
  } else {
    callback(400, {
      error: 'Error! There is a problem in your request.',
    });
  }
};

// Update existing user
handler._user.put = (requestProperties, callback) => {
  const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

  const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

  const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

  const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

  const tokenId = typeof (requestProperties.headersObject.token) === 'string' && requestProperties.headersObject.token.trim().length === 20 ? requestProperties.headersObject.token : false;
  if (firstName || lastName || password) {
    data.read('users', phone, (err, userData) => {
      const dataToUpdate = { ...parseJson(userData) };
      tokenHandler._token.verify(tokenId, phone, (token) => {
        if (token) {
          if (!err) {
            if (firstName) {
              dataToUpdate.firstName = firstName;
            }
            if (lastName) {
              dataToUpdate.lastName = lastName;
            }
            if (password) {
              dataToUpdate.password = password;
            }
            data.update('users', phone, dataToUpdate, (err1) => {
              if (!err1) {
                callback(200, {
                  success: 'Success! you have abled to update your account.',
                });
              } else {
                callback(400, {
                  error: 'Error! you have failed to update your account.',
                });
                console.log(err1);
              }
            });
          } else {
            callback(400, {
              error: "Error! You haven't user accound.",
            });
          }
        } else {
          callback(403, {
            error: 'Error! There was an authentication problem.',
          });
        }
      });
    });
  } else {
    callback(400, {
      error: "Error! You couldn't request sucessfully, some fields missing.",
    });
  }
};

// Delete the existing file
handler._user.delete = (requestProperties, callback) => {
  const phone = typeof (requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
  const tokenId = typeof (requestProperties.headersObject.token) === 'string' && requestProperties.headersObject.token.trim().length === 20 ? requestProperties.headersObject.token : false;
  if (phone) {
    tokenHandler._token.verify(tokenId, phone, (token) => {
      if (token) {
        data.deleteFile('users', phone, (err) => {
          if (!err) {
            callback(200, {
              success: 'Success! You have abled to delte your account successfully.',
            });
          } else {
            callback(500, {
              error: "Error! You couldn't delete your accout.",
            });
          }
        });
      } else {
        callback(403, {
          error: "Error! Your vrified token doesn't match.",
        });
      }
    });
  } else {
    callback(400, { error: 'Error! There was aproblen in your request.' });
  }
};

module.exports = handler;
