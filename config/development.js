'use strict';

/**
 * Development environment config of any configuration required to setup
 * the application which includes db, etc for developer purposes.
 */
const deepCopy = require('./deep-copy');
const production = require('./production');
const bformat = require('bunyan-format');
const formatOut = bformat({
  outputMode: 'short'
});
const url = require('url');

module.exports = deepCopy(production, {
  appLog: {
    name: 'NG2',
    streams: [{
      stream: formatOut,
      level: 'debug'
    }],
    serializers: {
      req: function(request) {
        let query = url.parse(request.url, true).query;
        let params = Object.assign(request.params, request.body, query);
        return {
          method: request.method,
          url: request.url,
          headers: request.headers,
          params: params
        };
      },
      statusCode: function(response) {
        return response.statusCode;
      }
    }
  },
  server: {
    port: 3001
  },
  jwt: {
    secret: 'secret'
  },
  mongo: {
    admin: {
      username: 'ng2-api',
      password: 'admin-dev-password'
    },
    dbURL: 'mongodb://localhost:27017',
    username: 'ng2-api-user',
    password: 'ng2-api-password-dev',
    dbName: 'ng2-api',
    authSource: 'ng2-api'
  }
});
