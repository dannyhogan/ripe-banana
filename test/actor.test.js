require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');

describe('test actor routes', () => {

  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create an actor using /POST', () => {
    return request(app)
      .post('/api/v1/actors')
      .send({ name: 'Danny', dob: '02-21-1997', pob: 'Portland, OR' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Danny',
          dob: expect.any(String),
          pob: 'Portland, OR',
          __v: 0
        });
      });
  });

  it('can get all actors by using /GET', async() => {
    const actors = await Actor.create({ name: 'Danny' }, { name: 'Tyler' }, { name: 'Peebs' });

    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        const actorsJSON = JSON.parse(JSON.stringify(actors));
        actorsJSON.forEach(actor => {
          expect(res.body).toContainEqual({
            name: actor.name,
            _id: actor._id
          });
        });
      });
  });

  it('can get an actor by ID using /GET', async() => {
    const actor = await Actor.create({ name: 'Danny' });

    return request(app)
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        const actorJSON = JSON.parse(JSON.stringify(actor));
        expect(res.body).toEqual({
          _id: actorJSON._id,
          name: actor.name,
          __v: 0
        });
      });
  });
});
