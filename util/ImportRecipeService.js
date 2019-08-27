var EdamamApiService = require('./EdamamApiService').EdamamApiService;
var FoodType = require('../models').FoodType;
var Recipe = require('../models').Recipe;
var Ingredient = require('../models').Ingredient;
var asyncForEach = require('./asyncForEach')

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
        calories: parseFloat(recipeResult.calories),
        timeToPrepare: parseFloat(recipeResult.totalTime),
        servings: parseFloat(recipeResult.yield)
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