'use strict';

/**
 * @author Jo-Ries Canino
 * @description Post Login
 */

const crypto = require('crypto');
const lib = require('../../lib');

/**
 * Initialized the schema Object
 */
const querySchema = {
  email: { in: ['body'],
    isEmpty: {
      negated: true,
      errorMessage: 'Missing Resource: Email'
    }
  },
  password: { in: ['body'],
    isEmpty: {
      negated: true,
      errorMessage: 'Missing Resource: Password'
    }
  }
};

const postLogin = (req, res, next) => {
  const password = crypto.createHash('sha256').update(req.$params.password).digest('hex');

  return req.db.user
  .findOne({
    email: req.$params.email,
    password: password
  })
  .then((user) => {
    if (!user) {
      req.log.error({
        error: 'Invalid Resource: Email/Password is incorrect.'
      }, 'handlers.user post-login [user.findOne] Error');

      return res.status(lib.httpCodes.BAD_REQUEST)
      .send(new lib.rpc.ValidationError({
        msg: 'Invalid Resource: Email/Password is incorrect.'
      }));
    }

    req.$scope.user = user;
    next();

    return user;
  })
  .catch((error) => {
    req.log.error({
      error: error
    }, 'handlers.user post-login [user.findOne] Error');

    return res.status(lib.httpCodes.SERVER_ERROR)
    .send(new lib.rpc.InternalError(error));
  });
};

const generateAuthToken = (req, res, next) => {
  let user = req.$scope.user;
  let payload = {
    email: user.email
  };
  let token = lib.jwt.encode(payload);

  req.$scope.token = token;

  next();
};

/**
 * Response data to client
 * @param {any} req request object
 * @param {any} res response object
 * @returns {any} body response object
 */
const response = (req, res) => {
  let user = req.$scope.user;
  let token = req.$scope.token;
  let body = lib.response.createOk({
    user: user,
    token: token
  });

  res.status(lib.httpCodes.OK).send(body);
};

module.exports.querySchema = querySchema;
module.exports.logic = postLogin;
module.exports.generateAuthToken = generateAuthToken;
module.exports.response = response;
