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

      FoodType.bulkCreate([
        {
          id: 1,
          name: 'chicken'
        },
        {
          id: 2,
          name: 'pizza'
        }
      ]).then(foodType => {

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
            calories: 400,
            timeToPrepare: 95,
            servings: 2,
            FoodTypeId: 2
          },
          {
            id: 3,
            name: 'chicken noodle soup',
            calories: 600,
            timeToPrepare: 180,
            servings: 4,
            FoodTypeId: 1
          }
        ])
      }).then(recipe => {

        return Ingredient.bulkCreate([
          {
            id: 1,
            text: '2 chicken breasts' ,
            RecipeId: 1
          },
          {
            id: 2,
            text: '1 cup grated parmesan' ,
            RecipeId: 1
          },
          {
            id: 3,
            text: '1 whole chicken' ,
            RecipeId: 2
          }
        ])
      }).then(ingredient => {
        return request(app)
        .get(`/api/v1/recipes/food_search?q=chicken`)
      }).then(response => {
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.have.lengthOf(2);

        let firstRecipe = response.body[0];
        expect(firstRecipe).to.include.all.keys('id', 'name', 'calories', 'timeToPrepare', 'servings', 'ingredients');
        expect(firstRecipe).to.not.include.key('createdAt');
        expect(firstRecipe).to.not.include.key('updatedAt');

        expect(firstRecipe.calories).to.equal('400');
        expect(firstRecipe.name).to.equal('chicken parmesan');
        expect(firstRecipe.ingredients).to.have.lengthOf(2);

        let firstIngredient = firstRecipe.ingredients[0];
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

          expect(response.body).to.deep.equal([]);

          done();
        })
    });
  });
});
