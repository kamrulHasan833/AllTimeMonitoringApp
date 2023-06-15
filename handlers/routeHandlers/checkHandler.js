/*
*
* Title: Check Route
* Description: Handler to handle check route
* Author: Kamrul Hasan
* Date: 06/11/2023
*
*/

// Dependencies
const data = require('../../lib/data');
const { parseJson, createRandomId } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const { maxCheck } = require('../../helpers/environment');

// Module Scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
  const methodValidation = ['post', 'get', 'put', 'delete'];

  if (methodValidation.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, {
      error: 'Error! Your requested method is invalid.',
    });
  }
};

handler._check = {};

// Create check
handler._check.post = (requestProperties, callback) => {
  const protocol = typeof (requestProperties.body.protocol) === 'string' && ['https', 'http'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

  const url = typeof (requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

  const method = typeof (requestProperties.body.method) === 'string' && ['post', 'get', 'put', 'delete'].indexOf(requestProperties.body.method.toLowerCase()) > -1 ? requestProperties.body.method : false;

  const successCode = typeof (requestProperties.body.successCode) === 'object' && requestProperties.body.successCode instanceof Array ? requestProperties.body.successCode : false;

  const timeoutSecond = typeof (requestProperties.body.timeoutSecond) === 'number' && requestProperties.body.timeoutSecond % 1 === 0 && requestProperties.body.timeoutSecond >= 1 && requestProperties.body.timeoutSecond <= 5 ? requestProperties.body.timeoutSecond : false;

  if (protocol && url && method && successCode && timeoutSecond) {
    // Get tokenId from requst header
    const tokenId = typeof (requestProperties.headersObject.token) === 'string' && requestProperties.headersObject.token.trim().length === 20 ? requestProperties.headersObject.token : false;
    // Read tokenData to get user phone
    data.read('token', tokenId, (err, tokenData) => {
      const tokData = parseJson(tokenData);
      if (!err && tokenData) {
        const { phone } = tokData;
        data.read('users', phone, (err2, uData) => {
          if (!err2 && uData) {
            const userData = parseJson(uData);
            const userPhone = userData.phone;
            // Verify check by  token
            tokenHandler._token.verify(tokenId, userPhone, (tokenValidate) => {
              if (tokenValidate) {
                const userChecks = typeof (userData.checks) === 'object' && userData.checks instanceof Array ? userData.checks : [];

                if (userChecks.length < maxCheck) {
                  const checkId = createRandomId(20);
                  const checkObject = {
                    checkId,
                    phone,
                    protocol,
                    url,
                    method,
                    successCode,
                    timeoutSecond,
                  };
                  // Create new check
                  data.create('checks', checkId, checkObject, (err3) => {
                    if (!err3) {
                      userData.checks = userChecks;
                      userData.checks.push(checkId);

                      // user updted by checks
                      data.update('users', phone, userData, (err4) => {
                        if (!err4) {
                          callback(200, checkObject);
                        } else {
                          callback(500, {
                            error: 'Error! There was a problem on server to add check to user',
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        error: 'Error! There is a problem on server to add check.',
                      });
                    }
                  });
                } else {
                  callback(401, {
                    error: 'Error! User already reach max check limits.',
                  });
                }
              } else {
                callback(403, {
                  error: 'Error! There was an authenticaltion problem.',
                });
              }
            });
          } else {
            callback(400, {
              error: 'Error! There is no user by this phone',
            });
          }
        });
      } else {
        callback(
          400,
          { error: 'Error! There was no tokenData by this tokenId.' },
        );
      }
    });
  } else {
    callback(400, {
      error: 'Error! There was problem in your request.',
    });
  }
};

// Read user
handler._check.get = (requestProperties, callback) => {
  const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;

  const tokenId = typeof (requestProperties.headersObject.token) === 'string' && requestProperties.headersObject.token.trim().length === 20 ? requestProperties.headersObject.token : false;

  if (id) {
    data.read('token', tokenId, (err, tokenData) => {
      if (!err && tokenData) {
        tokenHandler._token.verify(tokenId, parseJson(tokenData).phone, (tokenValidate) => {
          if (tokenValidate) {
            data.read('checks', id, (err2, checkData) => {
              if (!err2 && checkData) {
                const cd = parseJson(checkData);
                callback(200, cd);
              } else {
                callback(400, {
                  error: 'Error! There wan no check against your request.',
                });
              }
            });
          } else {
            callback(403, {
              error: 'Error! There was an athentication problem.',
            });
          }
        });
      } else {
        callback(500, {
          error: 'Error! There was a server problem.',
        });
      }
    });
  } else {
    callback(400, {
      error: 'Error! There was a problem in your request.',
    });
  }
};

// Update existing check
handler._check.put = (requestProperties, callback) => {
  const id = typeof (requestProperties.body.checkId) === 'string' && requestProperties.body.checkId.trim().length === 20 ? requestProperties.body.checkId : false;

  const protocol = typeof (requestProperties.body.protocol) === 'string' && ['https', 'http'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

  const url = typeof (requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

  const method = typeof (requestProperties.body.method) === 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) ? requestProperties.body.method : false;

  const successCode = typeof (requestProperties.body.successCode) === 'object' && requestProperties.body.successCode instanceof Array ? requestProperties.body.successCode : false;

  const timeoutSecond = typeof (requestProperties.body.timeoutSecond) === 'number' && requestProperties.body.timeoutSecond % 1 === 0 && requestProperties.body.timeoutSecond >= 1 && requestProperties.body.timeoutSecond <= 5 ? requestProperties.body.timeoutSecond : false;

  const tokenId = typeof (requestProperties.headersObject.token) === 'string' && requestProperties.headersObject.token.length === 20 ? requestProperties.headersObject.token : false;

  if (protocol || url || method || successCode || timeoutSecond) {
    data.read('token', tokenId, (err2, tokenData) => {
      if (!err2 && tokenData) {
        tokenHandler._token.verify(tokenId, parseJson(tokenData).phone, (validation) => {
          data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
              const updatedCheckData = parseJson(checkData);
              if (validation) {
                if (protocol) {
                  updatedCheckData.protocol = protocol;
                }
                if (url) {
                  updatedCheckData.url = url;
                }
                if (method) {
                  updatedCheckData.method = method;
                }
                if (successCode) {
                  updatedCheckData.successCode = successCode;
                }
                if (timeoutSecond) {
                  updatedCheckData.timeoutSecond = timeoutSecond;
                }
                data.update('checks', id, updatedCheckData, (err3) => {
                  if (!err3) {
                    callback(200, updatedCheckData);
                  } else {
                    callback(500, {
                      error: 'Error! There was an server problem to update check.',
                    });
                  }
                });
              } else {
                callback(405, {
                  error: 'Error! There was no id to check.',
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
        callback(500, {
          error: 'Error! There was an server problem',
        });
      }
    });
  } else {
    callback(400, {
      error: 'Error! There is a problem in your request.',
    });
  }
};

// Delete the existing file
handler._check.delete = (requestProperties, callback) => {
  const checkId = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;

  const tokenId = typeof (requestProperties.headersObject.token) === 'string' && requestProperties.headersObject.token.trim().length === 20 ? requestProperties.headersObject.token : false;
  if (checkId) {
    data.read('token', tokenId, (err, tokenData) => {
      if (!err && tokenData) {
        tokenHandler._token.verify(tokenId, parseJson(tokenData).phone, (validation) => {
          if (validation) {
            data.deleteFile('checks', checkId, (err2) => {
              if (!err2) {
                data.read('users', parseJson(tokenData).phone, (err3, userData) => {
                  if (!err3 && userData) {
                    const updatedUserData = parseJson(userData);
                    updatedUserData.checks.splice(updatedUserData.checks.indexOf(checkId), 1);
                    data.update('users', updatedUserData.phone, updatedUserData, (err4) => {
                      if (!err4) {
                        callback(200, {
                          success: 'Success! Check was deleted.',
                        });
                      } else {
                        callback(500, {
                          error: 'Error! There was a server problem.',
                        });
                      }
                    });
                  } else {
                    callback(500, {
                      error: 'Error! There was a server problem to update user',
                    });
                  }
                });
              } else {
                callback(500, {
                  error: 'Error! There was a server problem.',
                });
              }
            });
          } else {
            callback(403, {
              error: 'Error! There was an authenticaltion problem.',
            });
          }
        });
      } else {
        callback(400, {
          error: "Error! Token doesn't exist.",
        });
      }
    });
  } else {
    callback(400, {
      error: 'Error! There was a problem in your request.',
    });
  }
};

module.exports = handler;
