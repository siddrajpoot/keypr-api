const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://keypr-api:Keypr909!@ds017165.mlab.com:17165/main');

const reservationRoutes = require('./api/routes/reservation');
const hotelRoutes = require('./api/routes/hotel');

const port = process.env.PORT || 3001;

// middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/reservation', reservationRoutes);
app.use('/hotel', hotelRoutes);

// Error handling
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status(404);
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.listen(port, () => {
  console.log('Server running on port:', port);
});
