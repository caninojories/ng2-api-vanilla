'use strict';

let defaultEnvironment = require('./development');
let environment = process.env.NODE_ENV || 'development';
let activeConfig;

try {
  activeConfig = require(__dirname + '/' + environment);
} catch (e) {
  if (/Cannot find module/i.test(e.message)) {
    console.error('\t=============== ¡Warning! ===============\n\n'// eslint-disable-line no-console
      + '  There is no matching configuration for Node environment %j\n'
      + '  Using default configurations. See config/index.js for details.\n'
      + '\t=========================================\n',
    environment);
    activeConfig = defaultEnvironment;
  } else {
    process.exit(1);
  }
}

module.exports = activeConfig;
