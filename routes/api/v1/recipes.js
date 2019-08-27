var express = require('express');
var router = express.Router();

/* GET recipes based on food type. */
router.get('/food_search', function(req, res, next) {
  console.log(`q param = ${req.query.q}`)
  FoodType.findOne({
    where: {
      name: req.query.q
    }
  }).then(foodTypeResource => {
    if (foodTypeResource) {
      console.log(`foodTypeResource = ${foodTypeResource}`)
      let recipes = foodTypeResource.recipes
      res.status(200).send(JSON.stringify(recipes));
    } else {
      res.status(200).send(JSON.stringify([]));
    }
  }).catch(err => {
    let response = {error: err};
    res.status(500).send(JSON.stringify(response));
  })
});

module.exports = router;
