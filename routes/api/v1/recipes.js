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

/* GET recipes based on a range of calories  */
router.get('/calorie_search', function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  let query = req.query.q;
  if (query) {
    let rangeAry = query.split('-');
    if (rangeAry.length() === 2) {
      Recipe.findAll({
        where: {
          calories: {
            [Op.between]: [rangeAry[0], rangeAry[1]],
          }
        },
        include: [{
          model: Ingredient,
          as: "ingredients"
        }]
      }).then(recipes => {
        if (recipes) {
          console.log('*******************');
          console.log('recipes in controller =' + JSON.stringify(recipes));
          console.log('*******************');
  
          // const recipes = recipesDataValues.map(function(recipeDataValue) {
          //   return recipeDataValue.dataValues
          // })
          
          res.status(200).send(JSON.stringify(recipes, ["id", "name", "calories", "timeToPrepare", "servings", "ingredients", "id", "text"]));
        } else {
          res.status(200).send(JSON.stringify([]));
        }
      }).catch(err => {
        let response = { error: err };
        res.status(500).send(JSON.stringify(response));
      })

    } else {
      error = { error: 'A range of calories must be provided as a "q" query param (separated by a dash)' }
      res.status(400).send(JSON.stringify(error));
    }
  } else {
    error = { error: 'A range of calories must be provided as a "q" query param (separated by a dash)'}
    res.status(400).send(JSON.stringify(error));
  }
});

module.exports = router;
