# HikeTracker

## Team number: 6

Team members:
* s303504 Bruno Francesco
* s295429 De Paolis Gianmarco
* s303395 Durando Luca
* s306112 Greco Lorenzo
* s289262 Sansone Adamo
* s305007 Ünlüsoy Ege

## User Description 



| User| 
| ----------- | 
|guide@email.com| 
|hiker@email.com|
|hworker@email.com|
|manager@email.com|

In the email of each user is specified its type, if you are not logged in you are guests. 

## API Description 
### API signup e login
- POST `/api/signup`
   - Description: it adds a new user;
   - It requires the user to be entered; Request body example:
   ```
   
    {
    email: string,
    type: string,
    username: string,
    phoneNumber: string
    } 
   
    ```
   - No response body;It responds with 500 in case of error;
- POST `/api/sessions`
  - Description: send email logIn;
  - It requires an object representing a user (Content-Type: `application/json`):
  ```
    {
      user: 'testuser@polito.it', 
    }
  ```
  - No response body; It responds with `200 OK` (success) or `500 Internal Server Error` (generic error);

- DELETE `/api/sessions/current`
  - Description: Log-Out;
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
### API about hike(edit,create and get)
- GET `/api/hike`       
    - Description: it returns the list of filtered hikes 
    - request body example:
    {
      difficulty: int
      city: string
      province: string
      region: string
      length: float
      ascent: float
      expected_time: int
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
        "GpsTrack": "",
        "LocalGuideId": 1
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
        "GpsTrack": "",
        "LocalGuideId": 1
    },
    ...]
- GET `/api/hike/:id`       
  - it returns the point associated with the id
  - It requires an object with the id in the params
     

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
    "GpsTrack": "",
    "LocalGuideId": 1
  }
         
  ```
  - It returns the new Hike or 400 in case of error;


- PUT `/api/hike/:id`
  - Decription : it updates the fields of an hike
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
### API about point(edit,create and get)
- GET `api/point/:id`
  - Description: it returns the point associated with the id
  - It requires an object with the id in the params:
  ```
      {
        id: 1
      }
  ```
  - It responds with 400 if no id is passed, point otherwise:
    {
        Label: "punto",
        Latitude: 1000,
        Longitude: 1000,
        Elevation: 1000,
        City: Torino,
        Region: Piemonte,
        Province: Torino,
        Hut: {
            Description: "Punto Panoramico"
        }
    }
    
- POST `api/point/`
  - Description: It adds a point
  - The properties put in the body are optional:
     ```
      Point {
         Label: string
         Latitude: float
         Longitude: float
         Elevation: float
         City: string
         Region: string
         Province: string
         Hut: {
            Description: string
         },
         ParkingLot: {
            Description: string
         }
      }
     ```
  - It returns the new point or 400 in case of error
  
- PUT `api/point/:id`
    - Description: it updates the fields of a point
    - It requires the id of the point in the params and properties mentioned in the POST of the point are optional in the body
    - It returns the modified point or 400 in case of error;
       
- GET `api/point/`
   - Description: Gets list of filtered points
   - Hut Description and ParkingLot object are optional and can function as filters:
   ```
      {
         Hut: {
            Description: string
         }
      }
      
      Or
      {
         ParkingLot: {
         }
      }
      
   ```
   - It returns the list of point with the filter applied
### API about hiker
- PUT `api/hiker/performance`
   - Description: it updates the fields of a performance
   - It requires the fields of performance to update
   - It returns the modified performance or 500 in case of error;
- GET `api/hiker/performance`
   - Description: it returns the performance of the logged in user
   - It returns the performance or 404 in case of error;
- GET `api/hiker/hikesByPerf`
   - Description: it returns the list of hikes with performance parameters
   - It returns the list or 404 in case of error;
- POST `api/hiker/hike/:id`
   - Description: it creates a new activity of an hiker
    - It requires the id of the hike in the params 
    - It returns the modified point or 400 in case of error;
- PUT `api/hiker/hike/:id`
   - Description: it updates the fields of a point
    - It requires the id of the point in the params and properties mentioned in the POST of the point are optional in the body
    - It returns the modified point or 400 in case of error;
- GET `api/hiker/hike/:id`
   - Description: it updates the fields of a point
    - It requires the id of the point in the params and properties mentioned in the POST of the point are optional in the body
    - It returns the modified point or 400 in case of error;
- GET `api/hiker/hikes`
   - Description: it updates the fields of a point
    - It requires the id of the point in the params and properties mentioned in the POST of the point are optional in the body
    - It returns the modified point or 400 in case of error;




## Database 
Tables

- Table `Hike` - Contains (id, title, length, expected_time, ascent, difficulty,descricption,startpointid,endpointid,gpstrack,conditions,conddescription,localguideid)

- Table `Performance` - Contains (id,lenght, duration, altitude,difficulty,hikerid)

- Table `Point` - Contains (Id, Latitude, Longitude, Elevation, CIty, Region, Province, Type, Description)

- Table `User` - Contains (id, type, email, username, phoneNumber,verified,hutid) 

- Table `UserHikes` - Contains (id,user_id,hike_id, status , startedAt,refPoint_id)

- Table `ParkingLot` - Contains (id,description,name,position,capacity,pointid)

- Table `Hut` - Contains (id,name,description,altitude,beds,phone,email,website,pointid)


Relationships

- Hut Point 1:1 (refHut)

- Hut Hike n:n (huts)

- Hut User n:1 (hworker)

- ParkingLot Point 1:1 (refPL)

- Point Hike n:n (end,start,hikes)

- Point UserHikes n:n (hiker)

- Hike User 1:n (guide)

- Hike UserHikes n:n (hikes)

- Performance User 1:1 (perf)

- User UserHikes n:1 (hiker)