/*
*
* Title: Token Route
* Description: Handler to handle token route
* Author: Kamrul Hasan
* Date: 08/06/2023
*
*/

// Dependencies
const data = require('../../lib/data');
const { parseJson, createRandomId } = require('../../helpers/utilities');

// Module Scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const methodValidation = ['post', 'get', 'put', 'delete'];

  if (methodValidation.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, {
      error: 'Error! Your requested method is invalid.',
    });
  }
};

handler._token = {};

// Create new token
handler._token.post = (requestProperties, callback) => {
  const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

  const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

  if (phone && password) {
    data.read('users', phone, (err, uData) => {
      const userData = parseJson(uData);
      if (!err) {
        const tokenId = createRandomId(20);

        const expirse = Date.now() + 60 * 60 * 1000;
        const tokenObject = {
          phone, tokenId, expirse,
        };

        if (password === userData.password) {
          data.create('token', tokenId, tokenObject, (err2) => {
            if (!err2) {
              callback(200, {
                success: 'Success! you have abled to crate an token for 1 hour.',
              });
            } else {
              callback(500, {
                error: "Error! You don't have created an user accound for server issues.",
              });
              console.log(err2);
            }
          });
        } else {
          callback(400, {
            error: "Error! Password doesn't match.",
          });
        }
      } else {
        callback(400, {
          error: "Error! You don't have user account.",
        });
      }
    });
  } else {
    callback(400, {
      error: "Error! You couldn't request sucessfully, some fields missing.",
    });
  }
};

// Read token data
handler._token.get = (requestProperties, callback) => {
  const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;
  if (id) {
    data.read('token', id, (err, tokenData) => {
      if (!err) {
        callback(200, { ...parseJson(tokenData) });
      } else {
        callback(400, {
          error: "Error! Token id doesn't match.",
        });
      }
    });
  } else {
    callback(400, {
      error: 'Error! There is a problem in your request.',
    });
  }
};

// Update existing token
handler._token.put = (requestProperties, callback) => {
  const id = typeof (requestProperties.body.id) === 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;

  const extend = typeof (requestProperties.body.extend) === 'boolean' && requestProperties.body.extend ? requestProperties.body.extend : false;
  if (id && extend) {
    data.read('token', id, (err, tokenData) => {
      if (!err) {
        const tData = { ...parseJson(tokenData) };

        if (tData.expirse > Date.now()) {
          const newExpires = (Date.now() + 3600 * 1000) + tData.expirse;
          tData.expirse = newExpires;
          data.update('token', id, tData, (err2) => {
            if (!err2) {
              callback(200, {
                sucess: 'Success! You have abled to update token for 1 hour.',
              });
            } else {
              callback(500, {
                error: "Error! You couldn't uptate your token.",
              });
            }
          });
        } else {
          callback(400, {
            error: 'Error! Your token validated tims already expired.',
          });
        }
      } else {
        callback(
          400,
          { error: "Error! You don't have any token." },
        );
      }
    });
  } else {
    callback(400, {
      error: 'Error! There is an problem in your request.',
    });
  }
};

// Delete the existing token
handler._token.delete = (requestProperties, callback) => {
  const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;
  if (id) {
    data.deleteFile('token', id, (err) => {
      if (!err) {
        callback(200, {
          success: 'Success! You have deleted your token.',
        });
      } else {
        callback(200, {
          err,
        });
      }
    });
  } else {
    callback(400, {
      error: 'Error! There is a problem in your request.',
    });
  }
};

// Token verify
handler._token.verify = (id, phone, callback) => {
  data.read('token', id, (err, tokData) => {
    if (!err && tokData) {
      const tokenData = parseJson(tokData);
      if (tokenData.phone === phone && tokenData.expirse > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

module.exports = handler;
