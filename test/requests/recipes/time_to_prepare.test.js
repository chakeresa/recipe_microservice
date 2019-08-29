var app = require('../../../app');
var request = require("supertest");
var expect = require('chai').expect;
var FoodType = require('../../../models').FoodType;
var Recipe = require('../../../models').Recipe;
var Ingredient = require('../../../models').Ingredient;

describe('/api/v1/recipes/time_search?sort=ASC GET', function () {
  describe('user can get all recipes from the database in order by time to prepare', function () {
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
            timeToPrepare: 45,
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
            timeToPrepare: 30,
            servings: 4,
            FoodTypeId: 1
          },
          {
            id: 6,
            name: 'garlic bread',
            calories: 1200,
            timeToPrepare: 20,
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
        .get(`/api/v1/recipes/time_search?sort=ASC`)
      }).then(response => {
        expect(response.statusCode).to.equal(200);

        let firstRecipe = response.body[0];
        expect(firstRecipe).to.include.all.keys('id', 'name', 'calories', 'timeToPrepare', 'servings', 'ingredients');
        expect(firstRecipe).to.not.include.key('createdAt');
        expect(firstRecipe).to.not.include.key('updatedAt');

        expect(firstRecipe.calories).to.equal('1200');
        expect(firstRecipe.name).to.equal('garlic bread');
        expect(firstRecipe.servings).to.equal("4");
        expect(firstRecipe.ingredients).to.have.lengthOf(2);

        let firstIngredient = firstRecipe.ingredients[0];
        expect(firstIngredient).to.include.all.keys('id', 'text');
        expect(firstIngredient).to.not.include.key('createdAt');
        expect(firstIngredient).to.not.include.key('updatedAt');

        let secondRecipe = response.body[1];
        expect(secondRecipe).to.include.all.keys('id', 'name', 'calories', 'timeToPrepare', 'servings', 'ingredients');
        expect(secondRecipe).to.not.include.key('createdAt');
        expect(secondRecipe).to.not.include.key('updatedAt');

        expect(secondRecipe.calories).to.equal('1200');
        expect(secondRecipe.name).to.equal('spaghetti');
        expect(secondRecipe.servings).to.equal("4");
        expect(secondRecipe.ingredients).to.have.lengthOf(3);

        let secondIngredient = secondRecipe.ingredients[1];
        expect(secondIngredient).to.include.all.keys('id', 'text');
        expect(secondIngredient).to.not.include.key('createdAt');
        expect(secondIngredient).to.not.include.key('updatedAt');

        done();
      })
    });

    it('returns 200 if no results', (done) => {
      request(app)
        .get(`/api/v1/recipes/time_search?sort=ASC`)
        .then(response => {
          expect(response.statusCode).to.equal(200);

          expect(response.body).to.deep.equal([]);

          done();
        })
    });

    it('returns 400 if sort param is not ASC OR DESC', (done) => {
      request(app)
        .get(`/api/v1/recipes/time_search?sort=zebra`)
        .then(response => {
          expect(response.statusCode).to.equal(400);
          console.log("ERROR _______________________--------------------------")
          console.log(response.body)
          expect(response.body).to.deep.equal({'error': "Sort param must be 'ASC' or 'DESC'"});

          done();
        })
    })

    it('returns all recipes if no sort param is given', (done) => {
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
          },
          {
            id: 4,
            text: '5 cups chicken broth' ,
            RecipeId: 3
          }
        ])
      }).then(ingredient => {
        return request(app)
        .get(`/api/v1/recipes`)
      }).then(response => {
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.have.lengthOf(3);

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

        let lastRecipe = response.body[2];
        expect(lastRecipe).to.include.all.keys('id', 'name', 'calories', 'timeToPrepare', 'servings', 'ingredients');
        expect(lastRecipe).to.not.include.key('createdAt');
        expect(lastRecipe).to.not.include.key('updatedAt');

        expect(lastRecipe.calories).to.equal('600');
        expect(lastRecipe.name).to.equal('chicken noodle soup');
        expect(lastRecipe.ingredients).to.have.lengthOf(1);

        let onlyIngredient = lastRecipe.ingredients[0];
        expect(onlyIngredient).to.include.all.keys('id', 'text');
        expect(onlyIngredient).to.not.include.key('createdAt');
        expect(onlyIngredient).to.not.include.key('updatedAt');

        done();
      })
    });
  });
});
