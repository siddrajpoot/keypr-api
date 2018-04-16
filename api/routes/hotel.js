const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Hotel = require('../models/hotel');
const Reservation = require('../models/reservation');

// Get all hotel configs
router.get('/', (req, res, next) => {
  Hotel.find()
    .exec()
    .then(docs => {
      if (docs.length === 0) {
        res.status(400).json({ Message: 'No hotels exist' });
      } else {
        res.status(200).json(docs);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

// Get one hotel config
router.get('/:hotelId', (req, res, next) => {
  Hotel.findById(req.params.hotelId)
    .exec()
    .then(doc => {
      if (!doc) {
        res.status(400).json({ Message: 'Hotel does not exist' });
      } else {
        res.status(200).json(doc);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

// Create new hotel config
router.post('/', (req, res, next) => {
  const hotel = new Hotel({
    _id: new mongoose.Types.ObjectId(),
    rooms: req.body.rooms,
    overbook: req.body.overbook
  });

  hotel
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({ createdConfig: hotel });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

// Update hotel config
router.put('/:hotelId', (req, res, next) => {
  Hotel.update(
    { _id: req.params.hotelId },
    {
      $set: {
        rooms: req.body.rooms,
        overbook: req.body.overbook
      }
    }
  )
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

// Delete specific hotel
router.delete('/:hotelId', (req, res, next) => {
  Hotel.deleteOne({ _id: req.params.hotelId })
    .exec()
    .then(result => {
      if (result.n === '0') {
        res.status(400).json({ message: 'No hotel found' });
      } else {
        res.status(200).json(result);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

module.exports = router;
