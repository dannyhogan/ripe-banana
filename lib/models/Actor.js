const mongoose = require('mongoose');

const actorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dob: { type: Date },
  pob: { type: String }
});

const Actor = mongoose.model('Actor', actorSchema);

module.exports = Actor;
