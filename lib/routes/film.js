const { Router } = require('express');
const Film = require('../models/Film');

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
    Film
      .findById(req.params.id)
      .populate('studio', { _id: true, name: true })
      .populate('cast.actor', { _id: true, name: true })
      .select({ title: true, released: true, studio: true, cast: true })
      .then(film => res.send(film))
      .catch(next);
  });

// {
//     title, released,
//     studio: { _id, name },
//     cast: [{
//         _id, role,
//         actor: { _id, name }
//     }],
//     reviews: [{
//         id, rating, review,
//         reviewer: { _id, name }
//     ]
// }
