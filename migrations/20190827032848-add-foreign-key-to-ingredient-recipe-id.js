'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'Ingredients', 
      'RecipeId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Recipes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    );
  },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'Ingredients', 
      'RecipeId',
      {
        type: Sequelize.INTEGER
      }
    );
  }
};
