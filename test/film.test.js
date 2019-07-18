require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Film = require('../lib/models/Film');
const Actor = require('../lib/models/Actor');
const Studio = require('../lib/models/Studio');

describe('test film routes', () => {

  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let actor = null;
  let studio = null;

  beforeEach(async() => {
    actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'Danny' })));
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Danny' })));
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a film using /POST', () => {
    return request(app)
      .post('/api/v1/films')
      .send({
        title: 'Up',
        studio: studio._id,
        released: 1997,
        cast: [{
          actor: actor._id
        }]
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: 'Up',
          studio: studio._id,
          released: 1997,
          cast: [{
            _id: expect.any(String),
            actor: actor._id,
          }],
          __v: 0
        });
      });
  });

  it('test get all films using /GET', async() => {
    Film.create({
      title: 'Up',
      studio: studio._id,
      released: 1997,
      cast: [{
        actor: actor._id
      }]
    });

    return request(app)
      .get('/api/v1/films')
      .then(res => {
        expect(res.body).toEqual([
          {
            _id: expect.any(String),
            title: 'Up',
            studio: { _id: studio._id, name: studio.name },
            released: 1997
          }
        ]);
      });
  });

  it('can get a film by its ID using GET', async() => {
    const film = await Film.create({
      title: 'Up',
      studio: studio._id,
      released: 1997,
      cast: [{
        role: 'Lead',
        actor: actor._id
      }]
    });

    return request(app)
      .get(`/api/v1/films/${film._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: 'Up',
          released: 1997,
          studio: {
            _id: studio._id,
            name: studio.name
          },
          cast: [{
            _id: expect.any(String),
            role: expect.any(String),
            actor: { _id: actor._id, name: actor.name }
          }],
        });
      });
  });
});
