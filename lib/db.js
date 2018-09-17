'use strict';

let mongoose = require('mongoose');
let models = require('../models');
let config = require('../config');
let log = require('bunyan').createLogger(config.appLog);
let db = {};

let gracefulShutdown = (message, cb) => {
  mongoose.connection.close(() => {
    log.info(`Mongoose disconnected through ${message}`);
    cb();
  });
};

// define our listeners here
mongoose.connection.on('connected', () => {
  log.info(`Mongoose connected to: ${config.mongo.dbURL}`);
});
mongoose.connection.on('disconnected', () => {
  log.info(`Mongoose disconnected`);
});
mongoose.connection.on('error', (error) => {
  log.info(`Mongoose connection error ${error}`);
});
process.once('SIGUSR2', () => {
  gracefulShutdown('Nodemon Restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});
process.once('SIGINT', () => {
  gracefulShutdown('App Termination', () => {
    process.exit(0);
  });
});
process.once('SIGTERM', () => {
  gracefulShutdown('Heroku App Termination', () => {
    process.exit(0);
  });
});

for (let model in models) {
  db[model] = require(models[model]);
}

module.exports = db;
