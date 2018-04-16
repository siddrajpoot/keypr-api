const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Reservation = require('../models/reservation');
const Hotel = require('../models/hotel');

// Get all reservations for specific reservation
router.get('/:hotelId', (req, res, next) => { 
  Reservation.find({ hotelId: req.params.hoetelId })
    .exec()
    .then(docs => {
      if (docs.length === 0) {
        res.status(200).json({ Message: 'No reservations made for hotel' });
      }
      res.status(200).json(docs);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

// Get specific reservation
router.get('/:reservationId', (req, res, next) => {
  Reservation.findById(req.params.reservationId)
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

// Create reservation tied to specific hotelId
router.post('/', (req, res, next) => {
  const reservation = new Reservation({
    _id: new mongoose.Types.ObjectId(),
    guest: {
      name: req.body.guest.name,
      email: req.body.guest.email
    },
    hotelId: req.body.hotelId
  });

  const findHotelInfo = () => {
    return new Promise((resolve, reject) => {
      if (!req.body.hotelId) {
        res.status(500).json({ message: 'Need hotelId' });
      }
      Hotel.findById(req.body.hotelId)
        .exec()
        .then(doc => {
          console.log(doc);
          resolve(doc);
        })
        .catch(err => {
          console.log(error);
          reject();
        });
    });
  };

  findHotelInfo()
    .then(doc => {
      if (doc.reservationCount < doc.rooms + doc.rooms * doc.overbook) {
        reservation
          .save()
          .then(result => {
            console.log('Reservation was made');
            Hotel.update(
              { _id: req.body.hotelId },
              { $inc: { reservationCount: 1 } }
            )
              .exec()
              .then(result => {
                console.log(result);
              })
              .catch(error => {
                console.log(error);
                res.status(500).json({ error });
              });
            res.status(201).json({ createdReservation: reservation });
          })
          .catch(error => {
            console.log('Error');
            res.status(500).json({ error });
          });
      } else {
        res.status(400).json({ error: 'No more reservations allowed' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

// Update specific reservation
router.put('/:reservationId', (req, res, next) => {
  Reservation.update(
    { _id: req.params.reservationId },
    {
      $set: {
        guest: {
          name: req.body.guest.name,
          email: req.body.guest.email
        }
      }
    }
  )
    .exec()
    .then(doc => {
      console.log(doc);
      res.send(200).json(doc);
    })
    .catch();
});

// Delete reservation
router.delete('/:reservationId', (req, res, next) => {
  if (!req.body.hotelId) {
    res.status(400).json({ error: 'Need hotelId to delete reservation' });
  }
  Reservation.deleteOne({ _id: req.params.reservationId })
    .exec()
    .then(result => {
      console.log(result);
      if (result.n === 1) {
        Hotel.update(
          { _id: req.body.hotelId },
          { $inc: { reservationCount: -1 } }
        )
          .exec()
          .then(result => {
            console.log(result);
          })
          .catch(error => {
            console.log(error);
            res.status(500).json({ error });
          });
        res.status(200).json(result);
      } else {
        res.status(500).json({ error: 'Did not find any reservation' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(200).json({ error });
    });
});

module.exports = router;
