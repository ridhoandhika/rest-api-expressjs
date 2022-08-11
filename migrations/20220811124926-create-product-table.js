'use strict';

module.exports = {
   up: async (queryInterface, Sequelize) => {
   await queryInterface.createTable('products', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING
    },
    brand: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    }
   });
  },

  async down (queryInterface, Sequelize) {
   
     await queryInterface.dropTable('products');
     
  }
};
