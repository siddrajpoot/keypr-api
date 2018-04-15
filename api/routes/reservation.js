const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Reservation = require('../models/reservation');
const Hotel = require('../models/hotel');

router.get('/', (req, res, next) => {
  Reservation.find()
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

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

router.post('/', (req, res, next) => {
  const reservation = new Reservation({
    _id: new mongoose.Types.ObjectId(),
    guest: {
      name: req.body.guest.name,
      email: req.body.guest.email
    }
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

router.delete('/:reservationId', (req, res, next) => {
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
