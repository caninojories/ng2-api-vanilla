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
  express: {
    jsonSpaces: 2
  },
  mongo: {
    admin: {
      username: 'ng2',
      password: 'admin-dev-ng2'
    },
    dbURL: 'mongodb://localhost:27017',
    dbOptions: '?authSource=ng2',
    username: 'ng2-user',
    password: 'ng2-password-dev',
    dbName: 'ng2'
  }
});
