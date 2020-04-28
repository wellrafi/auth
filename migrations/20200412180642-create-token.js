'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tokens', {
      token: {
        type: Sequelize.TEXT
      },
      authId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Auths",
          key: "id"
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      },
      createdAt: {
        allowNull: true,  
        type: Sequelize.DATE
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tokens');
  }
  
};