var express = require('express');
var router = express.Router();
var FoodType = require("../../../models").FoodType;
var Ingredient = require("../../../models").Ingredient;
var Recipe = require("../../../models").Recipe;

/* GET recipes based on food type. */
router.get('/food_search', function(req, res, next) {
  console.log("=-=-=-=-=-=-=-=-")
  console.log(`q query = ${req.query.q}`)
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
      let recipes = foodTypeResource.recipes[0].dataValues
      console.log("recipes =")
      console.log(recipes)
      console.log("--------============------------------>>>>")

      res.setHeader("Content-Type", "application/json");
      res.status(200).send(JSON.stringify(recipes));
    } else {
      res.status(200).send(JSON.stringify([]));
    }
  }).catch(err => {
    console.log(err)
    let response = {error: err};
    res.status(500).send(JSON.stringify(response));
  })
});

module.exports = router;
