const mongoose = require('mongoose');

const studioSchema = mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  address: {
    city: {
      type: String
    },
    state: {
      type: String
    },
    country: {
      type: String
    }
  }
});

const Studio = mongoose.model('Studio', studioSchema);

module.exports = Studio;
