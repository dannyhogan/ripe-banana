const mongoose = require('mongoose');

const studioSchema = mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  address: {
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  }
});

const Studio = mongoose.model('Studio', studioSchema);

module.exports = Studio;
