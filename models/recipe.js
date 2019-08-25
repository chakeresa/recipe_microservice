'use strict';
module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define('Recipe', {
    name: DataTypes.STRING,
    FoodId: DataTypes.INTEGER,
    calories: DataTypes.DECIMAL,
    timeToPrepare: DataTypes.DECIMAL,
    servings: DataTypes.DECIMAL
  }, {});
  Recipe.associate = function(models) {
    Recipe.belongsTo(models.FoodType, {
      foreignKey: 'FoodTypeId',
      as: 'foodType'
    });
    Recipe.hasMany(models.Ingredient, { as: 'ingredients' });
  };
  return Recipe;
};