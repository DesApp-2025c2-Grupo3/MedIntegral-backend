'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Parentescos', [
      {
        relacion: 'Titular',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        relacion: 'Hijo/a',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        relacion: 'Conyugue',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        relacion: 'Familiar a cargo',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Parentescos', null, {});
  }
};