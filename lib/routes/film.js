const { Router } = require('express');
const Film = require('../models/Film');
const Review = require('../models/Review');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      title,
      studio,
      released,
      cast
    } = req.body;

    Film
      .create({ title, studio, released, cast })
      .then(film => res.send(film))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Film
      .find()
      .populate('studio', { _id: true, name: true })
      .select({ _id: true, title: true, released: true, studio: true })
      .then(film => res.send(film))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Promise.all([
      Film.findById(req.params.id)
        .select({ _id: false, __v: false })
        .populate('studio', { _id: true, name: true })
        .populate('cast.actor', { _id: true, name: true }),
      Review.find({ film: req.params.id })
        .select({ _id: true, rating: true, review: true, reviewer: true })
        .populate('reviewer', { _id: true, name: true })
    ])
      .then(([film, reviews]) => res.send({ ...film.toJSON(), reviews }))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Film
      .findByIdAndDelete(req.params.id)
      .then(deleted => res.send(deleted))
      .catch(next);
  });
