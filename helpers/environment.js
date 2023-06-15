/*
*
* Title: Environment
* Description: Handle all environment things
* Author: Kamrul Hasan
* Date: 06/06/2023
*
*/

// Module Scaffolding
const environment = {};

// Configure Environment for local server
environment.staging = {
  port: 3000,
  envName: 'Staging',
  maxCheck: 5,
  twilio: {
    from: '459829851',
    accountSid: '',
    authToken: '',
  },
};

// Configure Environment for live server
environment.production = {
  port: 5000,
  envName: 'Production',
  maxCheck: 5,
  twilio: {
    from: '4566546',
    accountSid: '',
    authToken: '',
  },
};

// Identify the current environment
const currntEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

// Identify environment to export
const environmentToExport = typeof (environment[currntEnvironment]) === 'object' ? environment[currntEnvironment] : environment.staging;

module.exports = environmentToExport;
