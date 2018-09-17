/*eslint-disable max-lines*/
'use strict';

const url = require('url');
const app = require('./app-config');
const api = require('./api');
const rpc = require('./lib/rpc');
const httpCodes = require('./lib/http-codes');
const router = new app.express.Router();

/**
 * Basically this would the referrence of all the api's
 * This would be beneficial when we setup all the needed
 * testing (unit, integration).
 */
router.use((req, res, next) => {
  /**
   * This will be used as a merge params
   * of the req.query, req.body, and req.params
   * from the request object.
   */
  let query = url.parse(req.url, true).query;
  req.$params = Object.assign(req.params, req.body, query);

  next();
});
app.use('/api/v1', router);
api.user(router);
app.use('*', (req, res, next) => {
  res.status(httpCodes.NOT_FOUND)
  .send(new rpc.ValidationError({
    msg: `Invalid Api: ${req.method} ${req.originalUrl}`
  }));

  next();
});

module.exports = app;
