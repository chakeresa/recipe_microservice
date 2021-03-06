var expect = require('chai').expect;
var EdamamApiService = require('../../util/EdamamApiService').EdamamApiService;

describe('EdamamApiService', function () {
  this.timeout(10000);
  
  it('returns JSON for 10 recipes with a particular foodType', function(done) {
    this.skip();

    let foodType = 'pizza';
    let service = new EdamamApiService(foodType);

    expect(service.foodType).to.equal(foodType);

    service.recipeResults()
    .then(response => {
      let hits = response.hits;
      expect(hits).to.have.lengthOf(10);
      
      let firstRecipe = hits[0].recipe;
      expect(firstRecipe).to.includes.all.keys('label', 'yield', 'ingredients', 'calories', 'totalTime')
      
      let firstIngredient = firstRecipe.ingredients[0];
      expect(firstIngredient).to.include.key('text')
      
      done();
    })
  });
});