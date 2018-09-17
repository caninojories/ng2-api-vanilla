'use strict';

/**
 * @author Jo-Ries Canino
 * @description Get User Details
 */

const lib = require('../../lib');

/**
 * Response data to client
 * @param {any} req request object
 * @param {any} res response object
 * @returns {any} body response object
 */
const response = (req, res) => {
  let user = req.$scope.user;
  let body = lib.response.createOk(user);

  res.status(lib.httpCodes.OK).send(body);
};

module.exports.response = response;
