'use strict';
module.exports = (sequelize, DataTypes) => {
  const FoodType = sequelize.define('FoodType', {
    name: DataTypes.STRING
  }, {});
  FoodType.associate = function(models) {
    // associations can be defined here
  };
  return FoodType;
};