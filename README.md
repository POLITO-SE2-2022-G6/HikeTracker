# HikeTracker

## Team number: 6

Team members:
* s303504 Bruno Francesco
* s295429 De Paolis Gianmarco
* s303395 Durando Luca
* s306112 Greco Lorenzo
* s289262 Sansone Adamo
* s305007 Ünlüsoy Ege


## API Description 
- POST `/api/signup`
   - Description: it adds a new user;
   - It requires the user to be entered; Request body example:
   ```
   
    {
    email: "email@test.com",
    type: "Hiker",
    username: "pincoPallino",
    phoneNumber: "123456789"
    } 
   
    ```
   - No response body;It responds with 500 in case of error;

- GET `/api/hike`       
    - Description:it returns the list of filtered hikes 
    - request body example:
    {
      difficulty: NULL
      city: NULL
      province: NULL
      region:NULL
      length: 7000
      ascent: NULL
      expected_time: NULL
    }
    - It responds with a list of filtered hikes or 400 in case of error
    -response body example:
    ```
   [
    {
        "id": 1,
        "Title": "Oriental Concrete Computer",
        "Length": 7885,
        "Expected_time": 390,
        "Ascent": -381,
        "Difficulty": 3,
        "StartPointId": 2,
        "EndPointId": 1,
        "Description": "Labore aspernatur exercitationem quidem quasi temporibus. Provident natus doloribus optio excepturi. Occaecati deleniti non amet ab maiores facere nihil eaque dolores. Quos earum aliquam incidunt asperiores repellat tempore incidunt minus ad. Recusandae deserunt dolorum perferendis mollitia eaque totam itaque. Distinctio laborum praesentium voluptatum cupiditate incidunt perferendis aut pariatur.",
        "GpsTrack": null
    },
    {
        "id": 2,
        "Title": "Licensed Granite Soap",
        "Length": 8941,
        "Expected_time": 35,
        "Ascent": -100,
        "Difficulty": 2,
        "StartPointId": 4,
        "EndPointId": 3,
        "Description": "Optio dolor itaque. Cum suscipit similique esse sed excepturi esse ipsa nobis. Maxime at saepe ad veritatis quod. Aliquam laborum deleniti. Itaque nam quo.",
        "GpsTrack": null
    },
    ...]
     

- POST `/api/hike` 
  - Description: it adds a hike in the hike list;
  - It requires the hike to be entered; Request body example:
   ```    
  {
    "id": 21,
    "Title": "stai andando forte",
    "Length": 20.5,
    "Expected_time": 13,
    "Ascent": 3.2,
    "Difficulty": 4,
    "StartPointId": null,
    "EndPointId": null,
    "Description": "Un Hike molto difficile",
    "GpsTrack": null
  }
         
  ```
  - It returns the new Hike or 400 in case of error;


- PUT `/api/hike/:id`
  - Decription : it updates the fields of a hike
  - It requires the hikeid of hike to modify(in request.params) and a request body:
  ```
     
     {         
        Title:  Null
        Length:     Null     
        Expected_time:  Null 
        Ascent:           Null
        Difficulty: 5     
        Start_point:          Null 
        End_point:              Null
        Reference_points: Null
        Description:      Null
        GpsTrack:Null

    }
  ```
  - Request params:
    {
      id:21
    }
- It returns the modified Hike or 400 in case of error;
- POST `/api/sessions`
  - Descrition: send email logIn;
  - It requires an object representing a user (Content-Type: `application/json`):
  ```
    {
      user: 'testuser@polito.it', 
    }
  ```
  - No response body; It responds with `200 OK` (success) or `500 Internal Server Error` (generic error);

- DELETE `/api/sessions/current`
  - Descrpition: Log-Out;
  - No request parameters and body;
  - No response body; It responds with `200 OK` (success) or `500 Internal Server Error` (generic error);

- GET `/api/sessions/current`
  - Description: Get all the user;
  - No request parameters and body;
  - It responds with `200 OK` (success) or `401` in case of unauthenticated user or `500` in case of generic error; Response body example:
  ```
    {
      id: 3,
      type: 'hiker'
      email:  'testuser@polito.it'
      username: Pippo
    }
  ```

## Database 
Tables

- Table `Hike` - Contains (id, Title, Length, Expected_time, Ascent, Difficulty, StartPointId, EndPointId, Description, GpsTrack)

- Table `Performance` - Contains (id, duration, altitude, UserId)

- Table `Point` - Contains (Id, Latitude, Longitude, Elevation, CIty, Region, Province, Type, Description)

- Table `User` - Contains (id, type, email, username, phoneNumber) with email being unique 

Relationships

- User -n Performance

- Point -n Hike.StartPoint

- Point -n Hike.EndPoint
