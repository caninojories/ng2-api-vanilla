'use strict';

const development = require('./development');

module.exports = Object.assign(development, {
  appLog: {
    name: 'Smartshore Bexio Unit Test',
    streams: [{
      stream: process.stdout,
      level: 'fatal'
    }]
  }
});
