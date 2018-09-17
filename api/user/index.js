'use strict';

const register = require('./register');
const login = require('./login');
const defaults = require('./defaults');

const USER = (api) => {
  api.use('/user', api);

  defaults(api);
  register(api);
  login(api);
};

module.exports = USER;
