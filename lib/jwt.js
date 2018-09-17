'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config');

const encode = (payload) => {
  let expiration = new Date();
  expiration.setDate(expiration.getDate() + 7);

  payload = Object.assign(payload, {
    exp: parseInt(expiration.getTime() / 1000)
  });

  return jwt.sign(payload, config.jwt.secret);
};

const decode = (token) => {
  return jwt.decode(token);
};

const verify = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.secret, (error, decoded) => {
      if (error) {
        return reject(error);
      }

      return resolve(decoded);
    });
  });
};

module.exports.encode = encode;
module.exports.decode = decode;
module.exports.verify = verify;
