var EdamamApiService = require('./EdamamApiService').EdamamApiService;
var FoodType = require('../models').FoodType;
var Recipe = require('../models').Recipe;
var Ingredient = require('../models').Ingredient;

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

class ImportRecipeService {
  constructor(foodType) {
    this.foodType = foodType;
  }

  async createRecipes() {
    var foodResource;
    let response = await FoodType.findOrCreate({
      where: {
        name: this.foodType
      }
    })
    foodResource = response[0].dataValues;
    let service = new EdamamApiService(this.foodType);
    let edamamResults = await service.recipeResults();
    let hits = edamamResults.hits;
    await asyncForEach(hits, async function(apiResult) {
      let recipeResult = apiResult.recipe
      await Recipe.create({
        name: recipeResult.label,
        FoodTypeId: foodResource.id,
        calories: recipeResult.calories,
        timeToPrepare: recipeResult.totalTime,
        servings: recipeResult.yield
      })
      
      await asyncForEach(recipeResult.ingredients, (async function(ingredient) {
        await Ingredient.create({
          text: ingredient.text,
          RecipeId: recipeResult.id
        })
      }))
    })
  }
}

module.exports = {
  ImportRecipeService: ImportRecipeService
}