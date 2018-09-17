'use strict';

const handlers = require('../../handlers');
const lib = require('../../lib');

let user = (api) => {
  api.get('/',
    lib.isTokenExist.user,
    handlers.user.getUser.response);
};

module.exports = user;
