var FoodType = require('../models').FoodType;
var Recipe = require('../models').Recipe;
var Ingredient = require('../models').Ingredient;
var shell = require('shelljs');

before(function() {
  console.log("global before hook starting...")
  this.timeout(20000);
  console.log("dropping database...")
  shell.exec('npx sequelize db:drop');
  console.log("creating database...")
  shell.exec('npx sequelize db:create');
  console.log("migrating database...")
  shell.exec('npx sequelize db:migrate');
});

beforeEach(async function() {
  console.log("global beforeEach hook starting...")
  this.timeout(20000);
  console.log("destroying all FoodTypes...")
  await FoodType.destroy({ where: {} })
  console.log("destroying all Recipes...")
  await Recipe.destroy({ where: {} })
  console.log("destroying all Ingredients...")
  await Ingredient.destroy({ where: {} })
});
