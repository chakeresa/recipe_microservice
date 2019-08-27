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
        id: 1,
        name: 'chicken',
        recipes: []
      }).then(foodType => {

        return Recipe.create({
          id: 1,
          name: 'chicken parmesan',
          calories: 400,
          timeToPrepare: 95,
          servings: 2,
          ingredients: [],
          FoodTypeId: 1
        })
      }).then(recipe => {

        return Ingredient.create({
          id: 1,
          text: '2 chicken breasts' ,
          text: '1 cup parmesan cheese',
          RecipeId: 1
          })
        }).then(() => {
          return FoodType.findAll({
            where: { name: "chicken" }
        })
        }).then(foodType => {
          console.log("---------------------------")
          console.log(foodType[0].dataValues)

          return request(app)
          .get(`/api/v1/recipes/food_search?q=chicken`)
      }).then(response => {
        expect(response.statusCode).to.equal(200);
        console.log("response========")
        console.log(response.body)
        expect(response.body).to.have.lengthOf(1);

        let firstRecipe = response.body[0];
        expect(firstRecipe).to.include.all.keys('id', 'name', 'calories', 'timeToPrepare', 'servings', 'ingredients');
        expect(firstRecipe).to.not.include.key('createdAt');
        expect(firstRecipe).to.not.include.key('updatedAt');

        expect(firstRecipe.calories).to.equal('400');
        expect(firstRecipe.name).to.equal('chicken parmesan');

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

          expect(response.body).to.have.lengthOf(0);

          done();
        })
    });
  });
});
