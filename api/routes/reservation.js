const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Reservation = require('../models/reservation');
const Hotel = require('../models/hotel');

router.get('/', (req, res, next) => {
  const hotelId = req.query.hotelId;
  if (hotelId) {
    Reservation.find({ hotelId })
      .exec()
      .then(docs => {
        if (docs.length === 0) {
          res.status(200).json({ Error: 'No reservations made for hotel' });
        }
        res.status(200).json(docs);
      })
      .catch(error => {
        res.status(500).json({ error });
      });
  } else {
    res.status(400).json({ Error: 'Missing Paramter hotelId' });
  }
});

// Get specific reservation
router.get('/:reservationId', (req, res, next) => {
  Reservation.findById(req.params.reservationId)
    .exec()
    .then(doc => {
      res.status(200).json(doc);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

// Create reservation tied to specific hotelId
router.post('/', (req, res, next) => {
  if (req.body.date.arrival >= req.body.date.departure) {
    res
      .status(500)
      .json({ Error: 'Arrival date is after departure date. Please adjust.' });
  }
  // create Reservation object
  const reservation = new Reservation({
    _id: new mongoose.Types.ObjectId(),
    guest: {
      name: req.body.guest.name,
      email: req.body.guest.email
    },
    date: {
      arrival: req.body.date.arrival,
      departure: req.body.date.departure
    },
    hotelId: req.body.hotelId
  });

  // This will find info of overbook percentage and rooms for specific hotel
  const findHotelInfo = new Promise((resolve, reject) => {
    Hotel.findById(req.body.hotelId)
      .exec()
      .then(hotelDoc => {
        if (hotelDoc) {
          resolve(hotelDoc);
        } else {
          reject({ Error: 'No hotel found' });
        }
      })
      .catch(error => {
        resolve(error);
      });
  });

  // This will find all reservations where there is overlap with the reservation to be created
  const findOverlap = new Promise((resolve, reject) => {
    Reservation.find({ hotelId: req.body.hotelId })
      /* 
    checks all reservations of a specified hotel for the following conditions
      If the date arrival is <= new reservation
        AND
      If the date departure is >= new reservation
    */
      .where('date.arrival')
      .lte(req.body.date.arrival)
      .where('date.departure')
      .gte(req.body.date.departure)
      .exec()
      .then(overlapDocs => {
        resolve(overlapDocs);
      })
      .catch(error => {
        reject(error);
      });
  });

  // Promise all function to find values for both DB queries
  Promise.all([findHotelInfo, findOverlap])
    .then(values => {
      // give each item of values[] an actual variable
      const hotelDoc = values[0];
      const reservationDoc = values[1];

      // create room count in consideration of overbook level
      const roomCount = hotelDoc.rooms + hotelDoc.overbook * hotelDoc.rooms;

      // Checks to see that the amount of overlapping reservations are less than rooms in hotel
      if (reservationDoc.length < roomCount) {
        reservation
          .save()
          .then(result => {
            res
              .status(201)
              .json({ Success: 'Reservation was created', result });
          })
          .catch(err => {
            res.status(500).json({ err });
          });
        // Errors out when too many reservations overlap the reservation to be created
      } else {
        res.status(400).json({ Error: 'No more rooms available' });
      }
    })
    .catch(error => {
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
      if (doc.n === 0) {
        res.status(400).json({ Error: 'No reservations found' });
      } else if (doc.nModified === 0) {
        res.status(400).json({ Error: 'No updates made on reservation' });
      } else {
        res
          .status(200)
          .json({ Success: 'Updates successfully made to reservation' });
      }
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

// Delete reservation
router.delete('/:reservationId', (req, res, next) => {
  if (!req.body.hotelId) {
    res.status(400).json({ error: 'Need hotelId to delete reservation' });
  }
  Reservation.deleteOne({ _id: req.params.reservationId })
    .exec()
    .then(result => {
      if (result.n === 1) {
        res.status(200).json({ Success: 'Reservation successfully deleted' });
      } else {
        res.status(500).json({ error: 'Did not find any reservation' });
      }
    })
    .catch(error => {
      res.status(200).json({ error });
    });
});

module.exports = router;
