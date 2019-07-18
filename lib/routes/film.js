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
      .populate('studio')
      .select({ _id: true, title: true, released: true, studio: true })
      .then(film => res.send(film))
      .catch(next);
  });

// [{
//     _id, title, released,
//     studio: { _id, name }
// }]
