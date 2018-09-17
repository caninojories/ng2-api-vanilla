'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const supertest = require('supertest');
const _ = require('lodash');
const lib = require('../../../../lib');
const fixtures = require('../../../fixtures');
let api = require('../../../../app-api');

describe('POST /api/v1/user/register', function() {
  let sandbox;
  let request;
  let fixturesClone;
  let saveUserStub;

  beforeEach(function() {
    sandbox = sinon.createSandbox();

    fixturesClone = _.cloneDeep(fixtures.api.user.postRegister);

    sandbox.stub(api.db.user, 'findOne').callsFake(() => {
      return Promise.resolve(fixtures.commons.user);
    });

    saveUserStub = sandbox.stub(api.db.user.prototype, 'save').callsFake(() => {
      return Promise.resolve(fixturesClone);
    });

    request = supertest(api)
    .post('/api/v1/user/register')
    .set('authorization', fixtures.commons.authorization);
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('[Success] Response', () => {
    it(`httpCode is ${lib.httpCodes.CREATED}`, (done) => {
      request
      .send(fixturesClone.body)
      .expect(lib.httpCodes.CREATED)
      .end(done);
    });

    it('responds with the correct RPC codes', (done) => {
      request
      .send(fixturesClone.body)
      .expect((response) => {
        expect(response.body.status).to.equal('SUCCESS');
        expect(response.body.statusCode).to.equal(lib.internalStatusCodes.SUCCESS);
        expect(response.body.httpCode).to.equal(lib.httpCodes.CREATED);
      })
      .end(done);
    });
  });

  describe('[Error: Missing Resource] Response', () => {
    it('body.email is required', (done) => {
      delete fixturesClone.body.email;

      request
      .send(fixturesClone.body)
      .expect(lib.httpCodes.BAD_REQUEST)
      .expect((response) => {
        expect(response.body.status).to.equal('ERROR');
        expect(response.body.statusMessage).to.equal('Missing Resource: Email');
        expect(response.body.statusCode).to.equal(lib.internalStatusCodes.MISSING_INPUT);
        expect(response.body.httpCode).to.equal(lib.httpCodes.BAD_REQUEST);
      })
      .end(done);
    });

    it('body.fullName is required', (done) => {
      delete fixturesClone.body.fullName;

      request
      .send(fixturesClone.body)
      .expect(lib.httpCodes.BAD_REQUEST)
      .expect((response) => {
        expect(response.body.status).to.equal('ERROR');
        expect(response.body.statusMessage).to.equal('Missing Resource: Full Name');
        expect(response.body.statusCode).to.equal(lib.internalStatusCodes.MISSING_INPUT);
        expect(response.body.httpCode).to.equal(lib.httpCodes.BAD_REQUEST);
      })
      .end(done);
    });

    it('body.password is required', (done) => {
      delete fixturesClone.body.password;

      request
      .send(fixturesClone.body)
      .expect(lib.httpCodes.BAD_REQUEST)
      .expect((response) => {
        expect(response.body.status).to.equal('ERROR');
        expect(response.body.statusMessage).to.equal('Missing Resource: Password');
        expect(response.body.statusCode).to.equal(lib.internalStatusCodes.MISSING_INPUT);
        expect(response.body.httpCode).to.equal(lib.httpCodes.BAD_REQUEST);
      })
      .end(done);
    });
  });

  describe('[Failure: Mongoose Error] User Model', () => {
    beforeEach(() => {
      saveUserStub.restore();
      saveUserStub = sandbox.stub(api.db.user.prototype, 'save').callsFake(() => {
        return Promise.reject(new Error('TestingError'));
      });
    });

    it(`httpCode is ${lib.httpCodes.SERVER_ERROR}`, (done) => {
      request
      .send(fixturesClone.body)
      .expect(lib.httpCodes.SERVER_ERROR)
      .end(done);
    });

    it('responds with the correct RPC codes', (done) => {
      request
      .send(fixturesClone.body)
      .expect((response) => {
        expect(response.body.status).to.equal('ERROR');
        expect(response.body.statusMessage).to.equal('TestingError');
        expect(response.body.httpCode).to.equal(lib.httpCodes.SERVER_ERROR);
        expect(response.body.statusCode).to.equal(lib.internalStatusCodes.EXTERNAL_FAILURE);
      })
      .end(done);
    });
  });
});
