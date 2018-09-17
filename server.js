'use strict';

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const sprintf = require('util').format;
const config = require('./config');
const Mongo = require('./lib/mongo');
const mongo = new Mongo(config.mongo);
const api = require(__dirname + '/app-api');

if (cluster.isMaster) {
  api.log.info('Master Process is online');
  for (let w = 0; w < numCPUs; w++) {
    cluster.fork();
  }
  cluster.on('exit', function(worker) {
    api.log.error({
      pid: worker.process.pid
    }, 'Worker died');
    cluster.fork();
  });

  cluster.on('online', function(worker) {
    api.log.info({
      pid: worker.process.pid
    }, 'New Worker online');
  });
} else {
  mongo.promiseConnection();
  api.use(function handleError(error, req, res, next) {
    api.log.error({
      error: error.message
    }, 'app-server [handleError] Error');

    res.status(500).send({
      status: 'ERROR',
      status_code: 100,
      status_message: error.message,
      http_code: 500
    });

    next();
  });

  process.nextTick(function() {
    api.listen(config.server.port, function() {
      api.log.info(sprintf('Server accepting requests on port %d',
        config.server.port));
    });
  });
}

process.on('uncaughtException', function psUncaughtException(error) {
  api.log.fatal(error, 'Uncaught Exception. Killing process now.');
  process.kill(1);
});
