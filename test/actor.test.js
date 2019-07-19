require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');

describe('test actor routes', () => {

  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let film = null;
  let studio = null;
  let actor = null;

  beforeEach(async() => {
    actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'Danny' })));
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Alchemy', address: { city: 'Portland', state: 'OR', country: 'USA' } })));
    film = JSON.parse(JSON.stringify(await Film.create({ title: 'Aladdin', studio: studio._id, released: 1997, cast: [{ role: 'Lead', actor: actor._id }] })));
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

    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        expect(res.body).toContainEqual({
          name: actor.name,
          _id: actor._id
        });
      });
  });

  it('can get an actor by ID using /GET', async() => {

    return request(app)
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        const actorJSON = JSON.parse(JSON.stringify(actor));
        expect(res.body).toEqual({
          _id: actorJSON._id,
          name: actor.name,
          films: [{
            _id: film._id,
            title: film.title,
            released: film.released
          }]
        });
      });
  });
});


