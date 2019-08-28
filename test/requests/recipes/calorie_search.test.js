var app = require('../../../app');
var request = require("supertest");
var expect = require('chai').expect;
var FoodType = require('../../../models').FoodType;
var Recipe = require('../../../models').Recipe;
var Ingredient = require('../../../models').Ingredient;

describe('api/v1/recipes/calorie_search GET', function () {
  describe('user can get all recipes within a given range of calories', function () {
    it('returns JSON with the recipe attributes and ingredients', (done) => {
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

        return Ingredient.bulkCreate([
          {
            id: 1,
            text: '2 chicken breasts',
            RecipeId: 1
          },
          {
            id: 2,
            text: '1 cup grated parmesan',
            RecipeId: 1
          },
          {
            id: 3,
            text: '2 chicken breasts',
            RecipeId: 4
          },
          {
            id: 4,
            text: '1/2 cup fresh basil',
            RecipeId: 4
          }
        ])
      }).then(ingredients => {
        return request(app)
          .get(`/api/v1/recipes/calorie_search?q=350-500`)
      }).then(response => {
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.have.lengthOf(2);

        let firstRecipe = response.body[0];
        expect(firstRecipe).to.include.all.keys('id', 'name', 'calories', 'timeToPrepare', 'servings', 'ingredients');
        expect(firstRecipe).to.not.include.key('createdAt');
        expect(firstRecipe).to.not.include.key('updatedAt');

        expect(firstRecipe.calories).to.be.oneOf(['400', '350']);
        expect(firstRecipe.name).to.be.oneOf(['chicken parmesan', 'basil chicken']);
        expect(firstRecipe.ingredients).to.have.lengthOf(2);

        let firstIngredient = firstRecipe.ingredients[0];
        expect(firstIngredient.text).to.equal('2 chicken breasts');
        expect(firstIngredient).to.include.all.keys('id', 'text');
        expect(firstIngredient).to.not.include.key('createdAt');
        expect(firstIngredient).to.not.include.key('updatedAt');

        done();
      })
    });

    it('returns 200 if no results', (done) => {
      request(app)
        .get('/api/v1/recipes/calorie_search?q=5-10')
      .then(response => {
        expect(response.statusCode).to.equal(200);

        expect(response.body).to.deep.equal([]);

        done();
      })
    });

    it('returns 400 if no calorie range is given', (done) => {
      request(app)
        .get('/api/v1/recipes/calorie_search')
      .then(response => {
        expect(response.statusCode).to.equal(400);

        expect(response.body).to.deep.equal({'error': 'A numerical range of calories must be provided as a "q" query param (separated by a dash)' });

        done();
      })
    })

    it('returns 400 if no start for calorie range is given', (done) => {
      request(app)
        .get('/api/v1/recipes/calorie_search?q=-500')
      .then(response => {
        expect(response.statusCode).to.equal(400);

        expect(response.body).to.deep.equal({'error': 'A numerical range of calories must be provided as a "q" query param (separated by a dash)' });

        done();
      })
    })

    it('returns 400 if no end for calorie range is given (with dash)', (done) => {
      request(app)
        .get('/api/v1/recipes/calorie_search?q=100-')
      .then(response => {
        expect(response.statusCode).to.equal(400);

        expect(response.body).to.deep.equal({'error': 'A numerical range of calories must be provided as a "q" query param (separated by a dash)' });

        done();
      })
    })

    it('returns 400 if no end for calorie range is given (without dash)', (done) => {
      request(app)
        .get('/api/v1/recipes/calorie_search?q=100')
      .then(response => {
        expect(response.statusCode).to.equal(400);

        expect(response.body).to.deep.equal({'error': 'A numerical range of calories must be provided as a "q" query param (separated by a dash)' });

        done();
      })
    })

    it('returns 400 if non-number(s) for calorie range given', (done) => {
      request(app)
        .get('/api/v1/recipes/calorie_search?q=zebra-500')
      .then(response => {
        expect(response.statusCode).to.equal(400);

        expect(response.body).to.deep.equal({'error': 'A numerical range of calories must be provided as a "q" query param (separated by a dash)' });

        done();
      })
    })
  });
});
