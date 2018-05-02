const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guest: {
    name: {
      type: String,
      required: 'Must have a name'
    },
    email: {
      type: String,
      required: 'Must have an email'
    }
  },
  date: {
    arrival: {
      type: Date,
      // default: Date.now,
      min: Date.now
    },
    departure: {
      type: Date
      // default: Date.now() + 7 * 24 * 60 * 60 * 1000
    }
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = mongoose.model('Reservation', reservationSchema);
