'use strict';

/**
 * This act as a middleware to check if
 * the token is valid or exist
 * @author Jo-Ries Canino
 */

const rpc = require('./rpc');
const jwt = require('./jwt');
const httpCodes = require('./http-codes');
const config = require('../config');
const log = require('bunyan').createLogger(config.appLog);

/**
 * Check if the user token is valid or exist
 * @param {any} req request object
 * @param {any} res response object
 * @param {any} next next object
 * @returns {next} returns the next handler - success response
 * @returns {rpc} returns the validation error - failed response
 */
const isUserTokenExist = (req, res, next) => {
  let authorization = req.headers.authorization;
  if (!authorization) {
    log.error({
      error: 'Missing Resource: Authorization'
    }, 'lib is-token-exist [authorization] Error');

    return res.status(httpCodes.BAD_REQUEST)
    .send(new rpc.ValidationError({
      msg: 'Missing Resource: Authorization'
    }));
  }

  let payload = jwt.decode(authorization);

  if (!payload) {
    log.error({
      error: 'Invalid Resource: Authorization'
    }, 'lib is-token-exist [payload] Error');

    return res.status(httpCodes.BAD_REQUEST)
    .send(new rpc.ValidationError({
      msg: 'Invalid Resource: Authorization'
    }));
  }

  return req.db.user
  .findOne({
    email: payload.email
  })
  .then((user) => {
    if (!user) {
      log.error({
        error: 'Invalid Resource: Authorization'
      }, 'lib is-token-exist [user.findOne] Error');

      return res.status(httpCodes.BAD_REQUEST)
      .send(new rpc.ValidationError({
        msg: 'Invalid Resource: Authorization'
      }));
    }

    req.$scope.user = user;
    next();
  })
  .catch(error => {
    return res.status(httpCodes.SERVER_ERROR)
    .send(new rpc.InternalError(error));
  });
};

module.exports.user = isUserTokenExist;
