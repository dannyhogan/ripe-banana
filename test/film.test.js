require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

const Film = require('../lib/models/Film');
const Actor = require('../lib/models/Actor');
const Studio = require('../lib/models/Studio');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');

describe('test film routes', () => {

  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let actor = null;
  let studio = null;
  let reviewer = null;
  let review = null;
  let film = null;

  beforeEach(async() => {
    actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'Danny' })));
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Danny' })));
    reviewer = JSON.parse(JSON.stringify(await Reviewer.create({ name: 'Danny', company: 'Fisher' })));
    film = JSON.parse(JSON.stringify(await Film.create({ title: 'Aladdin', studio: studio._id, released: 1997, cast: [{ role: 'Lead', actor: actor._id }] })));
    review = JSON.parse(JSON.stringify(await Review.create({ rating: 3, reviewer: reviewer._id, review: 'meh', film: film._id })));
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

    return request(app)
      .get('/api/v1/films')
      .then(res => {
        expect(res.body).toEqual([
          {
            _id: film._id,
            title: film.title,
            studio: { _id: studio._id, name: studio.name },
            released: film.released
          }
        ]);
      });
  });

  it('can get a film by its ID using GET', async() => {

    return request(app)
      .get(`/api/v1/films/${film._id}`)
      .then(res => {
        expect(res.body).toEqual({
          title: film.title,
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
          reviews: [{
            _id: expect.any(String),
            rating: review.rating,
            review: review.review,
            reviewer: {
              _id: reviewer._id,
              name: reviewer.name
            }
          }]
        });
      });
  });
});
