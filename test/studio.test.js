require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');

describe('test studio routes', () => {

  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
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
    const studio = await Studio.create({ name: 'Alchemy', address: { city: 'Portland', state: 'OR', country: 'USA' } });

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
          __v: 0
        });
      });
  });

});
