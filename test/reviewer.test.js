require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

const Reviewer = require('../lib/models/Reviewer');
const Review = require('../lib/models/Review');
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
  let reviewer = null;
  let film = null;
  let review = null;

  beforeEach(async() => {
    actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'Danny' })));
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Alchemy', address: { city: 'Portland', state: 'OR', country: 'USA' } })));
    reviewer = await Reviewer.create({ name: 'Danny', company: 'Fisher' });
    film = JSON.parse(JSON.stringify(await Film.create({ title: 'Aladdin', studio: studio._id, released: 1997, cast: [{ role: 'Lead', actor: actor._id }] })));
    review = await Review.create({ rating: 4, reviewer: reviewer._id, review: 'meh', film: film._id });
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

  it('can get all reviewers using /GET', async() => {
    return request(app)
      .get('/api/v1/reviewers')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.any(String),
          name: reviewer.name,
          company: reviewer.company
        }]);
      });
  });

  it('can get a reviewer by ID using /GET', () => {
    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: reviewer.name,
          company: reviewer.company,
          reviews: [{
            _id: review.id,
            rating: review.rating,
            review: review.review,
            film: {
              _id: film._id,
              title: film.title
            }
          }]
        });
      });
  });
});
