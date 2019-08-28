# Receipe Microservice (for the Quantified Self Project)
This API... (TODO) All responses are JSON.

The app is deployed at https://recipe-microservice.herokuapp.com/.

This project was part of [Turing School of Software & Design](https://turing.io)'s Back End Engineering program (Mod 4). See the project spec [here](https://backend.turing.io/module4/projects/quantified_self/qs_server_side). It was completed in 10 days by [Alexandra Chakeres](https://github.com/chakeresa) and [Ryan Miller](https://github.com/ryanmillergm).

View the project board at https://github.com/chakeresa/recipe_microservice/projects/1.

## Schema
![schema](./public/images/schema.png)

## Tech Stack
 - Framework: Express v4.16.4
 - Language: JavaScript
 - Database: PostgreSQL v7.12.1
 - ORM: Sequelize v5.15.1
 - Testing: Mocha v6.2.0 & Chai v4.2.0

## Other Packages
 - Secure ENV variable storage: dotenv
 - Run server using latest file updates: nodemon
 - Run shell commands: shelljs
 - Make HTTP requests in tests: supertest
 - Test coverage: nyc (Istanbul)
 - Make external API calls: request & request-promise

## Local Setup
 - `$ git clone git@github.com:chakeresa/recipe_microservice.git`
 - `$ cd recipe_microservice`
 - `$ createuser postgres -d`
 - `$ npm install`
 - `$ npx sequelize db:create`
 - `$ npx sequelize db:migrate`
 - `$ node ./util/seedScript.js`

## Running the Server Locally
 - `$ npm start` or `$ nodemon`
 - Access endpoints at `http://localhost:3000`

## Running the Test Suite
 - `$ npm test`

## API Endpoints
### Return all Recipe objects that are associated with a particular food type
Request:
```
GET /api/v1/recipes/food_search?q=FOOD_TYPE
Accept: application/json
```
Example successful response:
```
Status: 200
Content-Type: application/json
Body:
[
  {
    "id": 1,
    "name": "Chicken Soup",
    "calories": 300,
    "timeToPrepare": 90,
    "servings": 4,
    "ingredients": [
      {
        "id": 1,
        "text": "5 cups chicken stock"
      },
      {
        "id": 2,
        "text": "1/2 cup celery"
      }
    ]
  },
  {
    "id": 2,
    "name": "Chicken Parmesan",
    "calories": 400,
    "timeToPrepare": 60,
    "servings": 2,
    "ingredients": [
    ]
  }
]
```
Failed response (if no food type given for `q` query params):
```
Status: 400
Content-Type: application/json
Body:
{ 'error': 'Food type must be provided as a "q" query param' }
```

### Return all Recipe objects that are within a particular calorie range
Example Request:
```
GET /api/v1/recipes/calories_search?q=100-300
Accept: application/json
```
Example successful response:
```
Status: 200
Content-Type: application/json
Body:
[
  {
    "id": 1,
    "name": "Chicken Soup",
    "calories": 300,
    "timeToPrepare": 90,
    "servings": 4,
    "ingredients": [
      {
        "id": 1,
        "text": "5 cups chicken stock"
      },
      {
        "id": 2,
        "text": "1/2 cup celery"
      }
    ]
  },
  {
    "id": 3,
    "name": "Chicken Parmesan",
    "calories": 150,
    "timeToPrepare": 60,
    "servings": 1,
    "ingredients": [
    ]
  }
]
```
Failed response (if `q` query params are not two numbers separated by a dash):
```
Status: 400
Content-Type: application/json
Body:
{ 'error': 'A numerical range of calories must be provided as a "q" query param (separated by a dash)' }
```

## Core Contributors
 - Alexandra Chakeres, [@chakeresa](https://github.com/chakeresa)
 - Ryan Miller, [@ryanmillergm](https://github.com/ryanmillergm)

### How to Contribute
 - Fork and clone the [repo](https://github.com/chakeresa/recipe_microservice)
 - Make changes on your fork & push them to GitHub
 - Visit https://github.com/chakeresa/recipe_microservice/pulls and click `New pull request`
