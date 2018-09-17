'use strict';

const mongodb = require('mongodb');
const program = require('commander');
const config = require('../../config');
const log = require('bunyan').createLogger(config.appLog);
let okParams = true;

program
.version('1.0.0')
.option('-u, --mongoUrl <url>', 'Mongo DB connection URL', 'mongodb://localhost:27017')
.option('-x, --adminUser <username>', 'The admin username', config.mongo.admin.username)
.option('-y, --adminUserPassword <password>', 'The admin user password', config.mongo.admin.password)
.parse(process.argv);

// Connection URL
let url = program.mongoUrl;
let adminUser = program.adminUser;
let adminUserPassword = program.adminUserPassword;
let requiredParameters = {
  'url': url,
  'adminUser': adminUser,
  'adminUserPassword': adminUserPassword,
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

  let adminUserOptions = {
    fsync: true,
    roles: ['root']
  };

  client.db(config.mongo.dbName)
  .admin()
  .addUser(adminUser, adminUserPassword, adminUserOptions)
  .then(() => {
    log.info(`Added ${adminUser} user to ng2 database`);
    client.close();
  })
  .catch((error) => {
    log.error(`An error has occurred ${error}`);
    client.close();
  });
};

// Use connect method to connect to the server
// Connect to the database.
if (okParams) {
  mongodb.MongoClient.connect(url, {
    useNewUrlParser: true
  }, connectionHandler);
}
