var app = require('../../../app');
var request = require("supertest");
var expect = require('chai').expect;
var FoodType = require('../../../models').FoodType;
var Recipe = require('../../../models').Recipe;
var Ingredient = require('../../../models').Ingredient;

describe('api/v1/recipes/average_calories GET', function () {
  describe('user can get the average calories for recipes of a certain food type', function () {
    it('returns JSON with the average calories', (done) => {
      FoodType.bulkCreate([
        {
          id: 1,
          name: 'chicken'
        },
        {
          id: 2,
          name: 'pizza'
        }
      ]).then(foodTypes => {

        return Recipe.bulkCreate([
          {
            id: 1,
            name: 'chicken parmesan',
            calories: 400,
            timeToPrepare: 95,
            servings: 2,
            FoodTypeId: 1
          },
          {
            id: 2,
            name: 'pepperoni pizza',
            calories: 600,
            timeToPrepare: 90,
            servings: 2,
            FoodTypeId: 2
          },
          {
            id: 3,
            name: 'chicken noodle soup',
            calories: 550,
            timeToPrepare: 180,
            servings: 4,
            FoodTypeId: 1
          },
          {
            id: 4,
            name: 'basil chicken',
            calories: 350,
            timeToPrepare: 60,
            servings: 2,
            FoodTypeId: 1
          }
        ])
      }).then(recipes => {

        return request(app)
          .get(`/api/v1/recipes/average_calories?food_type=chicken`)
      }).then(response => {
        expect(response.statusCode).to.equal(200);

        let average_calories = (400 + 550 + 350) / 3.0;
        let expected = {
          average_calories: average_calories
        }
        expect(response.body).to.deep.equal(expected);

        done();
      })
    });

    it('returns 404 if no results', (done) => {
      request(app)
        .get('/api/v1/recipes/average_calories?food_type=candy')
      .then(response => {
        expect(response.statusCode).to.equal(404);

        expect(response.body).to.deep.equal({
          error: 'No recipes found for "candy"'
        });

        done();
      })
    });

    it('returns 400 if no food type is given', (done) => {
      request(app)
        .get('/api/v1/recipes/average_calories')
      .then(response => {
        expect(response.statusCode).to.equal(400);

        expect(response.body).to.deep.equal({'error': 'A "food_type" query param must be provided' });

        done();
      })
    })
  });
});
