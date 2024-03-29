const mongoose = require('mongoose');

const reviewerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  }
});

const Reviewer = mongoose.model('Reviewer', reviewerSchema);

module.exports = Reviewer;
