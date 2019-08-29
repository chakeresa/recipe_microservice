var express = require('express');
var router = express.Router();
var FoodType = require("../../../models").FoodType;
var Ingredient = require("../../../models").Ingredient;
var Recipe = require("../../../models").Recipe;
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

function serverError(res, err) {
  let response = { error: err };
  res.status(500).send(JSON.stringify(response));
};

function sendEmptyArray(res) {
  res.status(200).send(JSON.stringify([]));
};

function sendAverageCalories(res, recipes) {
  let avgCalories = Math.round(recipes[0].dataValues.avgCalories);
  res.status(200).send(JSON.stringify({ average_calories: avgCalories }));
};

var recipeAttributes = ["id", "name", "calories", "timeToPrepare", "servings", "ingredients", "id", "text"];

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

        res.status(200).send(JSON.stringify(recipes, recipeAttributes));
      } else {
        sendEmptyArray(res);
      }
    }).catch(err => {
      serverError(res, err);
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
          res.status(200).send(JSON.stringify(recipes, recipeAttributes));
        } else {
          sendEmptyArray(res);
        }
      }).catch(err => {
        serverError(res, err);
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
        res.status(200).send(JSON.stringify(recipeList, recipeAttributes));
      } else {
        sendEmptyArray(res);
      }
    }).catch(err => {
      serverError(res, err);
    })
  } else {
    error = {error: 'Number of ingredients must be provided as a "q" query param'}
    res.status(400).send(JSON.stringify(error));
  }
});

/* GET average calories (optional: for a particular food type) */
router.get('/average_calories', function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  let foodTypeName = req.query.food_type;
  let queryObject = {
    attributes: [[Sequelize.fn('AVG', Sequelize.col('calories')), 'avgCalories']]
  };
  if (foodTypeName) {
    FoodType.findOne({
      where: {
        name: foodTypeName
      }
    }).then(foodType => {
      if (foodType) {
        queryObject.where = {
          FoodTypeId: foodType.id
        };
        Recipe.findAll(queryObject)
        .then(recipes => {
          sendAverageCalories(res, recipes);
        })
      } else {
        res.status(404).send(JSON.stringify({ error: `No recipes found for "${foodTypeName}"` }));
      }
    }).catch(err => {
      serverError(res, err);
    })
  } else {
    Recipe.findAll(queryObject)
    .then(recipes => {
      sendAverageCalories(res, recipes);
    }).catch(err => {
      serverError(res, err);
    })
  }
});

module.exports = router;
