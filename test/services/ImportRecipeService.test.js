var expect = require('chai').expect;
var ImportRecipeService = require('../../util/ImportRecipeService').ImportRecipeService;
var FoodType = require('../../models').FoodType;
var Recipe = require('../../models').Recipe;
var Ingredient = require('../../models').Ingredient;

describe('ImportRecipeService', function () {
  this.timeout(20000);
  
  it('creates recipes for a particular foodType', async function(done) {
    let foodType = 'pizza';
    let service = new ImportRecipeService(foodType);

    expect(service.foodType).to.equal(foodType);

    await service.createRecipes()

    FoodType.count({ where: { name: foodType } }).then(count => {
      expect(count).to.equal(1);
      
      return Recipe.findAll()
    }).then(recipes => {
      expect(recipes).to.have.lengthOf(10);

      let firstRecipe = recipes[0];
      expect(firstRecipe.label).to.be.a('string');
      expect(firstRecipe.calories).to.be.a('number');
      expect(firstRecipe.timeToPrepare).to.be.a('number');
      expect(firstRecipe.servings).to.be.a('number');

      return Ingredient.findAll()
    }).then(ingredients => {
      let firstIngredient = ingredients[0];
      expect(firstIngredient.text).to.be.a('string');
      
      done();
    })
  });
});