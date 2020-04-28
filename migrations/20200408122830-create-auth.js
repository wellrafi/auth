'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Auths', {

      // it is top
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },

      // attributes account
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: true
      },

      // profile
      name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      photo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      postCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      birthday: {
        type: Sequelize.DATE,
        allowNull: true
      },

      // status account
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },

      // relations
      roleId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Roles",
          key: "id"
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      },

      // timestamps
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Auths');
  }
};