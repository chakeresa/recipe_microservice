var ImportRecipeService = require('./ImportRecipeService').ImportRecipeService;

let foodTypes = ['chicken', 'pizza', 'burger', 'muffin']

foodTypes.forEach(function(foodType) {
  let service = new ImportRecipeService(foodType);
  service.createRecipes();
})
