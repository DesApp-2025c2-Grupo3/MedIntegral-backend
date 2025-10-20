'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('PlanMedicos', [
      {
        plan: '210',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        plan: '310',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        plan: '410',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        plan: '510',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PlanMedicos', null, {});
  }
};