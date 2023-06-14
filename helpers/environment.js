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
    from: '+13613663715',
    accountSid: 'ACd3c1dd5255b3a15b7e07e48a690cf690',
    authToken: '732a5d3af70e166f9011fcfe96e02eea',
  },
};

// Configure Environment for live server
environment.production = {
  port: 5000,
  envName: 'Production',
  maxCheck: 5,
  twilio: {
    from: '+13613663715',
    accountSid: 'ACd3c1dd5255b3a15b7e07e48a690cf690',
    authToken: '732a5d3af70e166f9011fcfe96e02eea',
  },
};

// Identify the current environment
const currntEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

// Identify environment to export
const environmentToExport = typeof (environment[currntEnvironment]) === 'object' ? environment[currntEnvironment] : environment.staging;

module.exports = environmentToExport;
