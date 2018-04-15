const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Hotel = require('../models/hotel');
const Reservation = require('../models/reservation');

router.get('/:hotelId', (req, res, next) => {
  Hotel.findById(req.params.hotelId)
    .exec()
    .then(doc => {
      console.log(doc);
      res.status(200).json(doc);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

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

router.post('/', (req, res, next) => {
  const findCount = () => {
    return new Promise((resolve, reject) => {
      Reservation.count({})
        .exec()
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  };

  findCount().then(result => {
    const hotel = new Hotel({
      _id: new mongoose.Types.ObjectId(),
      rooms: req.body.rooms,
      overbook: req.body.overbook,
      reservationCount: result
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
});

module.exports = router;
