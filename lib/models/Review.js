const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reviewer',
    required: true
  },
  review: {
    type: String,
    maxlength: 140,
    required: true
  },
  film: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Film',
    required: true
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
