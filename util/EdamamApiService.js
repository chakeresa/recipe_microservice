var rp = require('request-promise');
require('dotenv').config();

class EdamamApiService {
  constructor(foodType) {
    this.foodType = foodType;
  }

  recipeResults() {
    let domain = 'https://api.edamam.com'
    let options = {
      uri: domain + '/search',
      qs: {
        q: this.foodType,
        app_id: process.env.EDAMAM_ID,
        app_key: process.env.EDAMAM_KEY,
        from: 0,
        to: 10,
        health: 'alcohol-free'
      },
      json: true
    };

    return rp(options);
  }
}

module.exports = {
  EdamamApiService: EdamamApiService
}