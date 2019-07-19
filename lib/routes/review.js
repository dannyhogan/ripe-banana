const { Router } = require('express');
const Review = require('../models/Review');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      rating,
      reviewer,
      review,
      film,
      createdAt,
      updatedAt
    } = req.body;

    Review
      .create({ rating, reviewer, review, film, createdAt, updatedAt })
      .then(review => res.send(review))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Review
      .find()
      .sort({ 'date': -1 })
      .limit(100)
      .populate('film', { _id: true, title: true })
      .select({ _id: true, rating: true, review: true, film: true })
      .then(review => res.send(review))
      .catch(next);
  });
