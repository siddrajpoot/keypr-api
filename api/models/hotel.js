const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  rooms: {
    type: Number,
    required: true,
    // default: 1,
    min: 0
  },
  overbook: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 1
  },
  reservationCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Hotel', hotelSchema);