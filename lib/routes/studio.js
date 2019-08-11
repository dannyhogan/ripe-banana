const { Router } = require('express');
const Studio = require('../models/Studio');
const Film = require('../models/Film');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      name,
      address
    } = req.body;

    Studio
      .create({ name, address })
      .then(studio => res.send(studio))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Studio
      .find()
      .select({ _id: true, name: true })
      .then(studios => res.send(studios))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Promise.all([
      Studio.findById(req.params.id)
        .select({ name: true, address: true, films: true }),
      Film
        .find({ studio: req.params.id })
        .select({ _id: true, title: true })
    ])
      .then(([studio, films]) => {
        res.send({ ...studio.toJSON(), films });
      })
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Film
      .find({ studio: req.params.id })
      .then(films => {
        if(films.length === 0) {
          Studio
            .findByIdAndDelete(req.params.id)
            .then(deleted => res.send(deleted))
            .catch(next);
        } else {
          res.send({ message: 'You can not delete a studio that has films!' });
        }
      });    
  });
