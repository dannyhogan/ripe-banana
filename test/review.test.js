require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');

describe('test review routes', () => {
  
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let film = null;
  let studio = null;
  let actor = null;
  let reviewer = null;

  beforeEach(async() => {
    actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'Danny' })));
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Danny' })));
    reviewer = JSON.parse(JSON.stringify(await Reviewer.create({ name: 'Danny', company: 'Alchemy' })));
    film = JSON.parse(JSON.stringify(await Film.create({ title: 'Up', studio: studio._id, released: 1997, cast: [{ actor: actor._id }] })));
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a review using /POST', () => {
    return request(app)
      .post('/api/v1/reviews')
      .send({ rating: 4, reviewer: reviewer._id, review: 'meh, it was ok.', film: film._id })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          rating: 4,
          reviewer: reviewer._id,
          review: 'meh, it was ok.',
          film: film._id,
          __v: 0
        });
      });
  });

  it('can get all reviews using /GET', async() => {
    const review = await Review.create({ rating: 4, reviewer: reviewer._id, review: 'meh, it was ok.', film: film._id });

    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.any(String),
          rating: 4,
          review: review.review,
          film: {
            _id: film._id,
            title: film.title
          }
        }]);
      });
  });

  it('only returns 100 of the most recent reviews', async() => {

    await Promise.all([...Array(101)].map(() => {
      return Review.create({
        rating: 4,
        reviewer: reviewer._id,
        review: 'meh, it was ok.',
        film: film._id
      });
    }));
    
    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        expect(res.body).toHaveLength(100);
      });

  });

  it('only returns 100 of the most recent reviews', async() => {
    await Promise.all([...Array(101)].map(() => {
      return Review.create({
        rating: 4,
        reviewer: reviewer._id,
        review: 'meh, it was ok.',
        film: film._id
      });
    }));
    
    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        expect(res.body[0]).toEqual({
          _id: expect.any(String),
          rating: 4,
          review: 'meh, it was ok.',
          film: {
            _id: film._id,
            title: film.title
          }
        });
      });

  });


});
