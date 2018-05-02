# Keypr Hotel API

This project was made for the keypr backend challenge.

### Prerequisites

Will need Node.js installed on your computer and API testing tool to make api request (ex. Postman).

```
Give examples
```

### Installing

Clone repo into directory of your choosing.

Enter `npm install` within directory through your terminal.

Enter `npm start` to start server.

## Built With

* Node.js
* Express.js
* MongoDB
* Mongoose

## API

#### Hotel

This APIs purpose is the hotel config. Main fields are:

    Rooms            - Set number of rooms for each hotel

    Overbook         - Set percentage of overbooking level you want for each hotel

    ReservationCount - How many reservations have been made for each room

* **URL**

  /hotel

  OR

  /hotel/:hotelId

* **Method**

  `GET` `POST` `PUT` `DELETE`

* **URL Params**

  `hotelId=[ObjectID]`

* **Data Params**

  **`GET` - all `/hotel`**

  **`GET` - one `/hotel/:hotelId`**

  _Required:_

  ```
  hotelId - specific hotelId
  ```

  **`POST` `/hotel`**

  _Required:_

  ```
  Rooms - set number of rooms for hotel

  Overbook - set overbook percentage for hotel (has to be between 0 - 1 (0% - 100%))
  ```

  **`PUT` `/hotel/:hotelId`**

  _Required:_

  ```
  hotelId

  Rooms

  Overbook
  ```

  **`DELETE` `/hotel/:hotelId`**

  _Required:_

  ```
  hotelId
  ```

* **Success Response**

  Code: 200

* **Error Response**

  Code: 400, 500

#### Reservation

This APIs purpose is for reservations for a specific hotel. Main fields are:

    guest                                           [object]

    guest.name      - Guest name                    [string]

    guest.email     - Guest email                   [string]

    date                                            [object]

    date.arrival    - Arrival date                  [Date]

    date.departure  - Departure date                [Date]

    hotelId         - ID for hotel associated with  [ObjectID]

* **URL**

  /reservation

  OR

  /reservation/:reservationId

  OR

  /reservation/:hotelId

* **Method**

  `GET` `POST` `PUT` `DELETE`

* **URL Params**

  `hotelId=[ObjectID]`

  `reservationId=[ObjectID]`

* **Data Params**

  **`GET` - all `/reservation/?hotelId=[_id]`**

  _Required:_

  `hotelId` - specific hotelId

  **`GET` - one `/reservation/:reservationId`**

  _Required:_

  `reservationId` - specific reservationId

  **`POST` `/hotel`**

  _Required:_

  ```
  guest {
    name,       // name for guest     [string]
    email       // email for guest    [string]
  },
  date {
    arrival,   // date of arrival     [date]
    departure, // date of departure   [date]
  },
  hotelId      // specific hotelId    [ObjectId]
  ```

  **`PUT` `/reservation/:reservationId`**

  _Required:_

  `reservationId` - specific id for reservation

  ```
  guest {
    name, // name for guest  [string]
    email // email for guest [string]
  }
  ```

  `Overbook`

  **`DELETE` `/reservation/:reservationId`**

  _Required:_

```
  reservationId

  hotelId
```

* **Success Response**

  Code: 200, 201

* **Error Response**

  Code: 400, 500

## Notes

API can support multiple hotel configs with reservations linked to each hotel. You can get all hotels configs, one hotel config, create hotel config, update hotel config, and delete hotel config.

## Release History

* 2.0

  * _/models/hotel.js_
    * removed reservationCount from schema
  * _/models/reservation.js_
    * date [object]
      * arrival - removed default, added min: Date.now
      * departure - removed default
  * _/routes/hotel.js_
    * Removed any console.logs()
    * Increased error handling and details of errors
  * _/routes/reservation.js_
    * /GET
      * Uses query params for hotelId
      * Error handling
    * /POST
      * Added logic to check arrival date is less than departure date
      * Added dates in Reservation object
      * Promise 1 - checks to find info of specific hotel (i.e. rooms and overbook)
      * Promise 2 - Logic to find overlapping reservations of exisiting reservations
      * Promise all - Checks to see if overlapping number is less than rooms in hotel. If it does it continues. If it does not, it will error out.
    * /PUT/:reservationId
      * Error handling
    * /DELETE/:reservationId
      * Removed logic for exisiting reservationCount
      * Error handling

* 1.0
  * Initial submit
