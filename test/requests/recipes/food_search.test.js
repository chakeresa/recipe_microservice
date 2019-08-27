var app = require('../../../app');
var request = require("supertest");
var expect = require('chai').expect;
var FoodType = require('../../../models').FoodType;
var Recipe = require('../../../models').Recipe;
var Ingredient = require('../../../models').Ingredient;

describe('api/v1/recipes/food_search GET', function () {
  describe('user can get all recipes from the database for a particular foodtype', function () {
    it('returns JSON with the attributes and ingredients', (done) => {
      let foodTypeName = 'pizza';
      FoodType.create({
        name: 'chicken',
        recipes: [
          {
            name: 'chicken parmesan',
            calories: 400,
            timeToPrepare: 95,
            servings: 2,
            ingredients: [
              { text: '2 chicken breasts' },
              { text: '1 cup parmesan cheese' }
            ]
          },
          {
            name: 'chicken noodle soup',
            calories: 300,
            timeToPrepare: 80,
            servings: 8,
            ingredients: [
              { text: '5 cups chicken stock' },
              { text: '1/2 lb noodles' }
            ]
          }
        ]
      }).then(foodType1 => {
        return FoodType.create({
          name: foodTypeName,
          recipes: [
            {
              name: 'margarita pizza',
              calories: 500,
              timeToPrepare: 120,
              servings: 6,
              ingredients: [
                { text: '1 lb pizza dough' },
                { text: '1 cup sliced tomatoes' },
                { text: '1 cup cheese' }
              ]
            },
            {
              name: 'pepperoni pizza',
              calories: 600,
              timeToPrepare: 90,
              servings: 4,
              ingredients: [
                { text: '2 cups pizza dough' },
                { text: '1.5 cups tomato sauce' },
                { text: '1/2 cup pepperonis' }
              ]
            }
          ]
        })
      }).then(foodType2 => {
        return request(app)
          .get(`/api/v1/recipes/food_search?q=${foodTypeName}`)
      }).then(response => {
        expect(response.statusCode).to.equal(200);

        expect(response.body).to.have.lengthOf(2);

        let firstRecipe = response.body[0];
        expect(firstRecipe).to.include.all.keys('id', 'name', 'calories', 'timeToPrepare', 'servings', 'ingredients');
        expect(firstRecipe).to.not.include.key('createdAt');
        expect(firstRecipe).to.not.include.key('updatedAt');
        
        expect(firstRecipe.calories).to.equal(500);
        expect(firstRecipe.name).to.equal('margarita pizza');
        
        let firstIngredient = firstIngredient.ingredients[0];
        expect(firstIngredient).to.include.all.keys('id', 'text');
        expect(firstIngredient).to.not.include.key('createdAt');
        expect(firstIngredient).to.not.include.key('updatedAt');

        done();
      })
    });

    it('returns 200 if no results', (done) => {
      request(app)
        .get('/api/v1/recipes/food_search?q=pizza')
        .then(response => {
          expect(response.statusCode).to.equal(200);

          expect(response.body).to.have.lengthOf(0);

          done();
        })
    });
  });
});
