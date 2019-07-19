require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Film = require('../lib/models/Film');
const Actor = require('../lib/models/Actor');

describe('test studio routes', () => {

  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let film = null;
  let actor = null;
  let studio = null;

  beforeEach(async() => {
    actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'Danny' })));
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Alchemy', address: { city: 'Portland', state: 'OR', country: 'USA' } })));
    film = JSON.parse(JSON.stringify(await Film.create({ title: 'Aladdin', studio: studio._id, released: 1997, cast: [{ role: 'Lead', actor: actor._id }] })));
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a new studio with /POST', () => {
    return request(app)
      .post('/api/v1/studios')
      .send({ name: 'Alchemy', address: { city: 'Portland', state: 'OR', country: 'USA' } })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Alchemy',
          address: { 
            city: 'Portland',
            state: 'OR',
            country: 'USA'
          },
          __v: 0
        });
      });
  });

  it('can get all studios using /GET', async() => {
    const studios = await Studio.create([
      { name: 'Alchemy' },
      { name: 'Pixar' },
      { name: 'Disney' }
    ]);

    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        const studioJSON = JSON.parse(JSON.stringify(studios));
        studioJSON.forEach(studio => {
          expect(res.body).toContainEqual({
            _id: studio._id,
            name: studio.name,
          });
        });
      });
  });

  it('can get a studio by its ID using /GET', async() => {

    return request(app)
      .get(`/api/v1/studios/${studio._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Alchemy',
          address: { 
            city: 'Portland',
            state: 'OR',
            country: 'USA'
          },
          films: [{
            _id: film._id,
            title: film.title
          }]
        });
      });
  });

  it('can NOT delete a studio if there are films', () => {
    return request(app)
      .delete(`/api/v1/studios/${studio._id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'You can not delete a studio that has films!'
        });
      });
  });

  it('can delte a studio with no films', async() => {
    const newStudio = await Studio.create({ name: 'Studio1', address: { city: 'Portland', state: 'OR', country: 'USA' } });
    return request(app)
      .delete(`/api/v1/studios/${newStudio._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: newStudio._id.toString(),
          name: 'Studio1',
          address: {
            city: 'Portland',
            state: 'OR',
            country: 'USA'
          },
          __v: 0
        });
      });
  });

});

// DELETE
// Studio, Films, and Actors can be deleted. However, studios cannot be 
// deleted if there are films and actors cannot be deleted who are in films.

