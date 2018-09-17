'use strict';

const handlers = require('../../handlers');
const lib = require('../../lib');

let login = (api) => {
  api.post('/login',
    lib.schemaValidator.validateParams(handlers.user.postLogin.querySchema),
    lib.schemaValidator.validationResult,
    handlers.user.postLogin.logic,
    handlers.user.postLogin.generateAuthToken,
    handlers.user.postLogin.response);
};

module.exports = login;
