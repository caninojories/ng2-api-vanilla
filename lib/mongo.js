'use strict';

const f = require('util').format;
const config = require('../config');
const log = require('bunyan').createLogger(config.appLog);
let Mongoose = require('mongoose');

let DatabaseConnection = /** @class */ (function() {
  /**
   * @param {object} options - object to pass for the db connection
   */
  function DatabaseConnection(options) {
    this.options = options;
    this.options.dbURL = `${options.dbURL}/${options.dbName}?authSource=${options.authSource}`;
    this.mongoose = Mongoose;
  }

  /**
   * Provides a mechanism to extract options as an object from a mongoDB URL as
   * the node mongo driver seems a little buggy
   *
   * @param {string} url
   * @param {IMongooseConnectionOptions} options
   * @returns {IMongooseConnectionOptions}
   */

  DatabaseConnection.getMongoConnectionOptionsFromUrl = function(url, options, skipOptions) {
    if (options === void 0) {
      options = {};
    }

    if (skipOptions === void 0) {
      skipOptions = [];
    }

    let result = {};
    let extractionList = { /*eslint-disable no-useless-escape*/
      // Extracts the replica set query string param or blank if none
      replicaSet: /^.*(?:\?|\&)replicaSet=([^&]+?|)(?:&.*$|$)/,
      // Extracts the authSource set query string param or blank if none
      authSource: /^.*(?:\?|\&)authSource=([^&]+?|)(?:&.*$|$)/,
      // Extracts the database name or blank if none
      dbName: /^mongodb:\/\/[^/]*\/?([^?&]*|$).*$/,
    };

    Object.keys(extractionList).map(function(optionName) {
      if (skipOptions.indexOf(optionName) !== -1) {
        return;
      }

      let value = url.replace(extractionList[optionName], '$1');
      if (value.length > 0 && value !== url) {
        result[optionName] = value;
      }
    });

    return Object.assign(options, result);
  };

  DatabaseConnection.prototype.promiseConnection = function() {
    let self = this;

    let credentials = [];
    let authPrefix = 'mongodb://';

    if (this.options.username) {
      credentials.push(encodeURIComponent(this.options.username));
      if (!this.options.password) {
        throw new Error('Password is required in options');
      }

      credentials.push(encodeURIComponent(this.options.password));

      authPrefix = f('mongodb://%s@', credentials.join(':'));
    }

    let options = DatabaseConnection
    .getMongoConnectionOptionsFromUrl(this.options.dbURL, {
      useNewUrlParser: true
    });

    this.mongoose.set('useCreateIndex', true);
    return this.mongoose.connect(this.options.dbURL.replace(/mongodb:\/\//, authPrefix), options)
    .then(function() {
      self.isConnected = true;
      log.debug('DB connection is established');
    })
    .catch(function(error) {
      log.error('An Error occurred while connecting to mongo');
      throw error;
    });
  };

  return DatabaseConnection;
}());

module.exports = DatabaseConnection;
