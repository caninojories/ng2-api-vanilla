'use strict';

const url = require('url');
const deepCopy = require('./deep-copy');

module.exports = deepCopy({}, {
  appLog: {
    name: 'NG2',
    streams: [{
      stream: process.stdout,
      level: 'info'
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
      res: function(request, response) {
        return response;
      }
    }
  },
  server: {
    port: process.env.NG2_SERVER_PORT
  },
  jwt: {
    secret: process.env.NG2_JWT_SECRET
  },
  mongo: {
    admin: {
      username: process.env.NG2_MONGO_ADMIN_USERNAME,
      password: process.env.NG2_MONGO_ADMIN_USERNAME
    },
    dbURL: process.env.NG2_MONGO_DBURL,
    username: process.env.NG2_MONGO_USERNAME,
    password: process.env.NG2_MONGO_PASSWORD,
    dbName: process.env.NG2_MONGO_DBNAME,
    authSource: process.env.NG2_MONGO_AUTHSOURCE
  }
});
