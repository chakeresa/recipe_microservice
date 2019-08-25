var expect = require('chai').expect;
var EdamamApiService = require('../../util/EdamamApiService').EdamamApiService;

describe('EdamamApiService', function () {
  it('returns JSON for 10 recipes with a particular foodType', (done) => {
    let foodType = 'pizza';
    let service = new EdamamApiService(foodType);

    expect(service.foodType).to.equal(foodType);

    done();
  });
});