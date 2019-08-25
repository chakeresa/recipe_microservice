var expect = require('chai').expect;
var EdamamApiService = require('../../util/EdamamApiService').EdamamApiService;

describe('EdamamApiService', function () {
  it('returns JSON for 10 recipes with a particular foodType', (done) => {
    let foodType = 'pizza';
    let service = new EdamamApiService(foodType);

    expect(service.foodType).to.equal(foodType);

    service.recipeResults()
    .then(response => {
      let hits = response.hits;
      expect(hits).to.have.lengthOf(10);
      
      let firstRecipe = hits[0].recipe;
      expect(firstRecipe).to.includes.all.keys('yield', 'ingredients', 'calories')
      
      let firstIngredient = firstRecipe.ingredients[0];
      expect(firstIngredient).to.include.key('text')
      
      done();
    })
  });
});