/*
*
* Title: Utilites
* Description: Utilites helper  to convert json strin to valid js object
* Author: Kamrul Hasan
* Date: 06/05/2023
*
*/

// Dependencies

// Module Scaffolding
const utilites = {};

// Convert json string to valid js object
utilites.parseJson = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }
  return output;
};

// Create Random Token ID
utilites.createRandomId = (tokenLength) => {
  const length = typeof (tokenLength) === 'number' ? tokenLength : false;
  const posibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123345789';
  if (length) {
    let output = '';
    for (let i = 0; i < tokenLength; i += 1) {
      // eslint-disable-next-line max-len
      const randomCharecter = posibleCharacters.charAt(Math.floor(Math.random() * posibleCharacters.length));

      output += randomCharecter;
    }
    return output;
  }
  return false;
};
// Module export
module.exports = utilites;
