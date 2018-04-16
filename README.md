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
This APIs purpose is the hotel config.  Main fields are:

	Rooms - Set number of rooms for each hotel

	Overbook - Set percentage of overbooking level you want for each hotel

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
  
  *Required:*
  
  `hotelId` - specific hotelId
  
  **`POST` `/hotel`**
  
  *Required:*
  
  `Rooms` - set number of rooms for hotel
  
  `Overbook` - set overbook percentage for hotel (has to be between 0 - 1 (0% - 100%))
  
  **`PUT` `/hotel/:hotelId`**
  
  *Required:*
  
  `hotelId`
  
  `Rooms`
  
  `Overbook`
  
  **`DELETE` `/hotel/:hotelId`**
  
  *Required:*
  
  `hotelId`
  
* **Success Response**

   Code: 200
   
* **Error Response**

  Code: 400, 500
  
#### Reservation
This APIs purpose is for reservations for a specific hotel.  Main fields are:

	guest - object
    
    guest.name - Guest name [string]
    
    guest.email - Guest email [string]

	hotelId - ID for hotel associated with [ObjectID]
    
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

  **`GET` - all `/reservation/:hotelId`**
  
  *Required:*
  
  `hotelId` - specific hotelId
  
  **`GET` - one `/reservation/:reservationId`**
  
  *Required:*
  
  `reservationId` - specific reservationId
  
  **`POST` `/hotel`**
  
  *Required:*
  
  ```
  guest {
  	name, // name for guest  [string]
    email // email for guest [string]
  },
  hotelId - specific hotelId [ObjectId]
  ```
  
  **`PUT` `/reservation/:reservationId`**
  
  *Required:*
  
  `reservationId` - specific id for reservation
  
  ```
  guest {
  	name, // name for guest  [string]
    email // email for guest [string]
  }
  ```
  
  `Overbook`
  
  **`DELETE` `/reservation/:reservationId`**
  
  *Required:*
  
  `reservationId`
  
  `hotelId`
  
* **Success Response**

   Code: 200
   
* **Error Response**

  Code: 400, 500
  
## Notes

API can support multiple hotel configs with reservations linked to each hotel. You can get all hotels configs, one hotel config, create hotel config, update hotel config, and delete hotel config. 