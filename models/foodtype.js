'use strict';
module.exports = (sequelize, DataTypes) => {
  const FoodType = sequelize.define('FoodType', {
    name: DataTypes.STRING
  }, {});
  FoodType.associate = function(models) {
    FoodType.hasMany(models.Recipe, { as: 'recipes' });
  };
  return FoodType;
};