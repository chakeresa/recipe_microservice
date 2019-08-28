var express = require('express');
var router = express.Router();
var FoodType = require("../../../models").FoodType;
var Ingredient = require("../../../models").Ingredient;
var Recipe = require("../../../models").Recipe;

/* GET recipes based on food type. */
router.get('/food_search', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  if (req.query.q) {
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
  } else {
    error = {error: 'Food type must be provided as a "q" query param'}
    res.status(400).send(JSON.stringify(error));
  }
});

router.get('/ingredient_search', function(req, res, next) {

  res.setHeader("Content-Type", "application/json");
  if (req.query.q) {
    Recipe.findAll({
      include: [{
        model: Ingredient,
        as: "ingredients"
      }]
    }).then(recipes => {
      let recipeList = []
      recipes.forEach(recipe => {

        if (recipe.ingredients.length == req.query.q) {
          recipeList.push(recipe)
        }
      })
      return recipeList
    }).then(recipeList => {
      if (recipeList) {
        res.status(200).send(JSON.stringify(recipeList, ["id", "name", "calories", "timeToPrepare", "servings", "ingredients", "id", "text"]));
      } else {
        res.status(200).send(JSON.stringify([]));
      }
    }).catch(err => {
      let response = {error: err};
      res.status(500).send(JSON.stringify(response));
    })
  } else {
    error = {error: 'Food type must be provided as a "q" query param'}
    res.status(400).send(JSON.stringify(error));
  }
});

module.exports = router;
