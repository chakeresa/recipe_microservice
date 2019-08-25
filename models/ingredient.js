'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ingredient = sequelize.define('Ingredient', {
    text: DataTypes.STRING,
    RecipeId: DataTypes.INTEGER
  }, {});
  Ingredient.associate = function(models) {
    Ingredient.belongsTo(models.Recipe, {
      foreignKey: 'RecipeId',
      as: 'recipe'
    })
  };
  return Ingredient;
};