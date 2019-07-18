require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');

describe('test film routes', () => {

  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a Reviewer using /POST', () => {
    return request(app)
      .post('/api/v1/reviewers')
      .send({ name: 'Danny', company: 'Alchemy' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Danny',
          company: 'Alchemy',
          __v: 0
        });
      });
  });

});
