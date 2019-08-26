var EdamamApiService = require('./EdamamApiService').EdamamApiService;
var FoodType = require('../models').FoodType;
var Recipe = require('../models').Recipe;
var Ingredient = require('../models').Ingredient;

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
    hits.forEach(async function(apiResult) {
      let recipeResult = apiResult.recipe
      console.log(`starting import of recipe ${recipeResult.label}`)
      await Recipe.create({
        name: recipeResult.label,
        FoodTypeId: foodResource.id,
        calories: recipeResult.calories,
        timeToPrepare: recipeResult.totalTime,
        servings: recipeResult.yield
      })
      console.log(`finished import of recipe ${recipeResult.label}`)
      
      recipeResult.ingredients.forEach(async function(ingredient) {
        console.log(`starting import of ingredient${ingredient.text}`)
        await Ingredient.create({
          text: ingredient.text,
          RecipeId: recipeResult.id
        })
        console.log(`finished import of ingredient ${ingredient.text}`)
      })
    })
  }
}

module.exports = {
  ImportRecipeService: ImportRecipeService
}