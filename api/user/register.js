'use strict';

const handlers = require('../../handlers');
const lib = require('../../lib');

let register = (api) => {
  api.post('/register',
    lib.schemaValidator.validateParams(handlers.user.postRegister.querySchema),
    lib.schemaValidator.validationResult,
    handlers.user.postRegister.logic,
    handlers.user.postRegister.generateAuthToken,
    handlers.user.postRegister.response);
};

module.exports = register;
