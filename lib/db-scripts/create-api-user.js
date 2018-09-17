'use strict';

const mongodb = require('mongodb');
const program = require('commander');
const f = require('util').format;
const databaseConnection = require('../mongo');
const config = require('../../config');
const log = require('bunyan').createLogger(config.appLog);
let okParams = true;

program
.version('1.0.0')
.option('-u, --mongoUrl <url>', 'Mongo DB connection URL', 'mongodb://localhost:27017?authSource=admin')
.option('-x, --adminUser <username>', 'The admin username', config.mongo.admin.username)
.option('-y, --adminUserPassword <password>', 'The admin user password', config.mongo.admin.password)
.option('-d, --ng2DbName <database name>', 'The name of the ng2 database', config.mongo.dbName)
.option('-u, --ng2DbUser <username>', 'The normal API db user name', config.mongo.username)
.option('-p, --ng2DbUserPassword <password>', 'The normal API db user password', config.mongo.password)
.parse(process.argv);

let url = program.mongoUrl;
let adminUser = program.adminUser;
let adminUserPassword = program.adminUserPassword;
let ng2DbName = program.ng2DbName;
let ng2DbUser = program.ng2DbUser;
let ng2DbUserPassword = program.ng2DbUserPassword;

let requiredParameters = {
  'url': url,
  'adminUser': adminUser,
  'adminUserPassword': adminUserPassword,
  'ng2DbName': ng2DbName,
  'ng2DbUser': ng2DbUser,
  'ng2DbUserPassword': ng2DbUserPassword,
};

for (let i = 0, a = Object.keys(requiredParameters); i < a.length; i++) {
  let name = a[i];
  let parameter = requiredParameters[name];

  if (!parameter || parameter.length < 1) {
    log.error(`Argument -- ${name} is required`);
    okParams = false;
  }
}

let connectionHandler = function(err, client) {
  if (err) {
    log.error(`An error has occurred ${err}`);
    return;
  }

  log.info('Connected successfully to server');

  let ng2UserOptions = {
    fsync: true,
    roles: [{
      role: 'readWrite',
      db: ng2DbName
    }]
  };

  client.db(ng2DbName)
  .addUser(ng2DbUser, ng2DbUserPassword, ng2UserOptions)
  .then(() => {
    log.info(`Added ${ng2DbUser} user to admin database with readWrite access to ${ng2DbName}`);
    client.close();
  })
  .catch((error) => {
    log.error(`An error has occurred ${error}`);
    client.close();
  });
};

if (okParams) {
  let credentials = [];
  let authPrefix = 'mongodb://';

  if (adminUser.length !== 0) {
    credentials.push(encodeURIComponent(adminUser));
    if (adminUserPassword.length !== 0) {
      credentials.push(encodeURIComponent(adminUserPassword));
    }

    authPrefix = f('mongodb://%s@', credentials.join(':'));
  }

  let options = databaseConnection.getMongoConnectionOptionsFromUrl(
    url, {
      useNewUrlParser: true
    }, ['dbName'] // Not supported by mongo driver
  );

  mongodb.MongoClient.connect(url.replace(/mongodb:\/\//, authPrefix), options, connectionHandler);
}
