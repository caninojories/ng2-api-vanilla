'use strict';

/**
 * @author Jo-Ries Canino
 * @description Post Register
 */

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
  fullName: { in: ['body'],
    isEmpty: {
      negated: true,
      errorMessage: 'Missing Resource: Full Name'
    }
  },
  password: { in: ['body'],
    isEmpty: {
      negated: true,
      errorMessage: 'Missing Resource: Password'
    }
  }
};

const postRegister = (req, res, next) => {
  const user = new req.db.user({// eslint-disable-line new-cap
    email: req.$params.email,
    fullName: req.$params.fullName,
    password: req.$params.password
  });

  return user.save()
  .then((user) => {
    req.$scope.user = user.removePassword();
    next();

    return user;
  })
  .catch((error) => {
    req.log.error({
      error: error
    }, 'handlers.user post-register [user.save] Error');

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
  let body = lib.response.created({
    user: user,
    token: token
  });

  res.status(lib.httpCodes.CREATED).send(body);
};

module.exports.querySchema = querySchema;
module.exports.logic = postRegister;
module.exports.generateAuthToken = generateAuthToken;
module.exports.response = response;
