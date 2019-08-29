var express = require('express');
var router = express.Router();
var FoodType = require("../../../models").FoodType;
var Ingredient = require("../../../models").Ingredient;
var Recipe = require("../../../models").Recipe;
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

/* GET recipes based on food type */
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
      let response = { error: err };
      res.status(500).send(JSON.stringify(response));
    })
  } else {
    error = { error: 'Food type must be provided as a "q" query param' }
    res.status(400).send(JSON.stringify(error));
  }
});

/* GET recipes based on a range of calories */
router.get('/calorie_search', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  let query = req.query.q;
  if (query) {
    let rangeAry = query.split('-');
    if (rangeAry.length === 2 && /^\d+$/.test(rangeAry[0]) && /^\d+$/.test(rangeAry[1])) {
      Recipe.findAll({
        where: {
          calories: {
            [Op.between]: [rangeAry[0], rangeAry[1]]
          }
        },
        include: [{
          model: Ingredient,
          as: "ingredients"
        }]
      }).then(recipes => {
        if (recipes) {
          res.status(200).send(JSON.stringify(recipes, ["id", "name", "calories", "timeToPrepare", "servings", "ingredients", "id", "text"]));
        } else {
          res.status(200).send(JSON.stringify([]));
        }
      }).catch(err => {
        let response = { error: err };
        res.status(500).send(JSON.stringify(response));
      })

    } else {
      error = { error: 'A numerical range of calories must be provided as a "q" query param (separated by a dash)' }
      res.status(400).send(JSON.stringify(error));
    }
  } else {
    error = { error: 'A numerical range of calories must be provided as a "q" query param (separated by a dash)'}
    res.status(400).send(JSON.stringify(error));
  }
});

/* GET recipes based on number of ingredients */
router.get('/ingredient_search', function(req, res, next) {
  queryNumber = req.query.q
  res.setHeader("Content-Type", "application/json");
  if (/^\d+$/.test(queryNumber)) {
    Recipe.findAll({
      include: [{
        model: Ingredient,
        as: "ingredients"
      }]
    }).then(recipes => {
      let recipeList = []
      recipes.forEach(recipe => {

        if (recipe.ingredients.length == queryNumber) {
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
    error = {error: 'Number of ingredients must be provided as a "q" query param'}
    res.status(400).send(JSON.stringify(error));
  }
});

/* GET average calories (optional: for a particular food type) */
router.get('/average_calories', function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  let foodType = req.query.food_type;
  let queryObject = {
    attributes: [[Sequelize.fn('AVG', Sequelize.col('calories')), 'avgCalories']]
  };
  if (foodType) {
    console.log('inside controller 5');
    queryObject.include = [{
      model: FoodType,
      as: 'foodType',
      attributes: ['name'],
      where: {
        name: foodType
      }
    }]
  }
  console.log('inside controller 6');
  Recipe.findAll(queryObject)
    .then(recipes => {
      let avgCalories = Math.round(recipes[0].dataValues.avgCalories);
      res.status(200).send(JSON.stringify({ average_calories: avgCalories }));
    }).catch(err => {
      console.log('**************');
      console.log('error = ' + err)
      console.log('**************');
      let error = { error: err };
      res.status(500).send(JSON.stringify(error));
    })
});

module.exports = router;
