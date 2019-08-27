var express = require('express');
var router = express.Router();
var FoodType = require("../../../models").FoodType;
var Ingredient = require("../../../models").Ingredient;
var Recipe = require("../../../models").Recipe;

/* GET recipes based on food type. */
router.get('/food_search', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  FoodType.findOne({
    where: { name: req.query.q },
    include: [{
      model: Recipe,
      as: "recipes",
      include: [{
        model: Ingredient,
        as: "ingredients"
      }]
    }]
  }).then(foodTypeResource => {
    if (foodTypeResource) {
      let recipesDataValues = foodTypeResource.recipes

      const recipes = recipesDataValues.map(function(recipeDataValue) {
        return recipeDataValue.dataValues
      })

      res.status(200).send(JSON.stringify(recipes, ["id", "name", "calories", "timeToPrepare", "servings", "ingredients", "id", "text"]));
    } else {
      res.status(200).send(JSON.stringify([]));
    }
  }).catch(err => {
    let response = {error: err};
    res.status(500).send(JSON.stringify(response));
  })
});

module.exports = router;
