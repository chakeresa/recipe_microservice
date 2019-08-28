var app = require('../../../app');
var request = require("supertest");
var expect = require('chai').expect;
var FoodType = require('../../../models').FoodType;
var Recipe = require('../../../models').Recipe;
var Ingredient = require('../../../models').Ingredient;

describe('/api/v1/recipes/ingredient_search GET', function () {
  describe('user can get all recipes from the database with a particular number of ingredients', function () {
    it('returns JSON with the attributes and ingredients', (done) => {

      FoodType.bulkCreate([
        {
          id: 1,
          name: 'pasta'
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
            calories: 1500,
            timeToPrepare: 95,
            servings: 5,
            FoodTypeId: 2
          },
          {
            id: 3,
            name: 'eggplant parmesan',
            calories: 1100,
            timeToPrepare: 60,
            servings: 4,
            FoodTypeId: 1
          },
          {
            id: 4,
            name: 'lasagna',
            calories: 2000,
            timeToPrepare: 180,
            servings: 8,
            FoodTypeId: 1
          },
          {
            id: 5,
            name: 'spaghetti',
            calories: 1200,
            timeToPrepare: 45,
            servings: 4,
            FoodTypeId: 1
          },
          {
            id: 6,
            name: 'garlic bread',
            calories: 1200,
            timeToPrepare: 45,
            servings: 4,
            FoodTypeId: 2
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
            text: '1 cup of breadcrumbs' ,
            RecipeId: 1
          },
          {
            id: 4,
            text: '1 16oz pizza dough' ,
            RecipeId: 2
          },
          {
            id: 5,
            text: '1 cup pizza sauce' ,
            RecipeId: 2
          },
          {
            id: 6,
            text: '2 mozzarella cheese' ,
            RecipeId: 2
          },
          {
            id: 7,
            text: '1 pound pepperoni' ,
            RecipeId: 2
          },
          {
            id: 8,
            text: '1 large eggplant' ,
            RecipeId: 3
          },
          {
            id: 9,
            text: '1 1/2 cups parmesan cheese' ,
            RecipeId: 3
          },
          {
            id: 10,
            text: '1 1/2 cups breadcrumbs' ,
            RecipeId: 3
          },
          {
            id:11,
            text: '4 lasagna pasta sheets' ,
            RecipeId: 4
          },
          {
            id:12,
            text: '4 cups marinara' ,
            RecipeId: 4
          },
          {
            id:13,
            text: '4 cups mozzarella' ,
            RecipeId: 4
          },
          {
            id:14,
            text: '2 cups ricotta' ,
            RecipeId: 4
          },
          {
            id:15,
            text: '1 lb spaghetti' ,
            RecipeId: 5
          },
          {
            id:16,
            text: '1 lb hamburger' ,
            RecipeId: 5
          },
          {
            id:17,
            text: '4 cups tomato sauce' ,
            RecipeId: 5
          },
          {
            id:18,
            text: '1 16 oz pizza dough' ,
            RecipeId: 6
          },
          {
            id:19,
            text: '1/4 cup garlic butter' ,
            RecipeId: 6
          }
        ])
      }).then(() => {
        return request(app)
        .get(`/api/v1/recipes/ingredient_search?q=3`)
      }).then(response => {
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.have.lengthOf(3);

        let firstRecipe = response.body[0];
        expect(firstRecipe).to.include.all.keys('id', 'name', 'calories', 'timeToPrepare', 'servings', 'ingredients');
        expect(firstRecipe).to.not.include.key('createdAt');
        expect(firstRecipe).to.not.include.key('updatedAt');

        expect(firstRecipe.calories).to.equal('400');
        expect(firstRecipe.name).to.equal('chicken parmesan');
        expect(firstRecipe.ingredients).to.have.lengthOf(3);

        let firstIngredient = firstRecipe.ingredients[0];
        expect(firstIngredient).to.include.all.keys('id', 'text');
        expect(firstIngredient).to.not.include.key('createdAt');
        expect(firstIngredient).to.not.include.key('updatedAt');

        return request(app)
        .get(`/api/v1/recipes/ingredient_search?q=4`)
      }).then(response => {
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.have.lengthOf(2);

        let firstRecipe = response.body[0];
        expect(firstRecipe).to.include.all.keys('id', 'name', 'calories', 'timeToPrepare', 'servings', 'ingredients');
        expect(firstRecipe).to.not.include.key('createdAt');
        expect(firstRecipe).to.not.include.key('updatedAt');

        expect(firstRecipe.calories).to.equal('1500');
        expect(firstRecipe.name).to.equal('pepperoni pizza');
        expect(firstRecipe.ingredients).to.have.lengthOf(4);

        let firstIngredient = firstRecipe.ingredients[0];
        expect(firstIngredient).to.include.all.keys('id', 'text');
        expect(firstIngredient).to.not.include.key('createdAt');
        expect(firstIngredient).to.not.include.key('updatedAt');

        done();
      })
    });

    it('returns 200 if no results', (done) => {
      request(app)
        .get('/api/v1/recipes/ingredient_search?q=7')
        .then(response => {
          expect(response.statusCode).to.equal(200);

          expect(response.body).to.deep.equal([]);

          done();
        })
    });

    it('returns 400 if number of ingredients is not given', (done) => {
      request(app)
        .get('/api/v1/recipes/ingredient_search')
        .then(response => {
          expect(response.statusCode).to.equal(400);

          expect(response.body).to.deep.equal({'error': 'Number of ingredients must be provided as a "q" query param'});

          done();
        })
    })

    it('returns 400 if number of ingredients is not a number', (done) => {
      request(app)
        .get('/api/v1/recipes/ingredient_search?q=zebra')
        .then(response => {
          expect(response.statusCode).to.equal(400);

          expect(response.body).to.deep.equal({'error': 'Number of ingredients must be provided as a "q" query param'});

          done();
        })
    })
  });
});
