const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/v1/studios', require('../lib/routes/studio'));
app.use('/api/v1/actors', require('../lib/routes/actor'));
app.use('/api/v1/films', require('../lib/routes/film'));
app.use('/api/v1/reviewers', require('../lib/routes/reviewer'));
app.use('/api/v1/reviews', require('../lib/routes/review'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
