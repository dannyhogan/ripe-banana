const { Router } = require('express');
const Actor = require('../models/Actor');
const Film = require('../models/Film');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      name,
      dob,
      pob
    } = req.body;

    Actor
      .create({ name, dob, pob })
      .then(actor => res.send(actor))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Actor
      .find()
      .select({ name: true, _id: true })
      .then(actors => res.send(actors))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Promise.all([
      Actor.findById(req.params.id)
        .select({ __v: false }),

      Film
        .find({ 'cast.actor': req.params.id })
        .select({ _id: true, released: true, title: true })
    ])
      .then(([actor, films]) => res.send({ ...actor.toJSON(), films }))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Film
      .find({ 'cast.actor': req.params.id })
      .then(films => {
        if(films.length === 0) {
          Actor
            .findByIdAndDelete(req.params.id)
            .then(deleted => res.send(deleted))
            .catch(next);
        } else {
          res.send({ message: 'You can not delete an actor that is in films!' });
        }
      });    
  })

  .put('/:id', (req, res, next) => {

    const {
      name,
      company
    } = req.body;

    Actor
      .findByIdAndUpdate(req.params.id, { name, company }, { new: true })
      .then(updated => {
        res.send(updated);
      })
      .catch(next);
  });
