'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const perfHooks = require('perf_hooks');
let app = express();
let config = require('./config');
let log = require('bunyan').createLogger(config.appLog);
let db = require('./lib/db');
let utilitites = require('./lib/utilities');

app.db = db;
app.log = log;
app.express = express;
app.set('json spaces', config.express.jsonSpaces);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  credentials: false
}));
app.use(function setupScope(req, res, next) {
  req.$scope = {};
  req.$params = {};
  req.db = app.db;
  req.log = app.log;

  next();
});
app.use(function trafficLogger(req, res, next) {
  let chunks = [];
  let resToReapply = res.end;
  let start = perfHooks.performance.now();
  let end;

  req.log.info({
    req: req
  }, 'HTTP Request');
  res.end = function(chunk) {
    if (chunk) {
      chunks.push(new Buffer.from(chunk));
    }

    let body = Buffer.concat(chunks).toString('utf8');
    if (utilitites.isJsonString(body)) {
      body = JSON.parse(body);
    }

    if (body.httpCode > 300) {
      req.log.error({
        response: body
      }, 'HTTP Response');
    } else {
      req.log.info({
        response: body
      }, 'HTTP Response');
    }

    resToReapply.apply(res, arguments);
  };

  res.once('finish', function resLogger() {
    end = perfHooks.performance.now();
    req.log.info({
      statusCode: res
    }, 'HTTP Finish');
    req.log.info(end - start, 'Api Performance Time');
  });

  next();
});

module.exports = app;
