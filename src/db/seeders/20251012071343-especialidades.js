'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Especialidades', [
      { nombre: 'Cardiología' },
      { nombre: 'Dermatología' },
      { nombre: 'Neurología' },
      { nombre: 'Pediatría' },
      { nombre: 'Psiquiatría' },
      { nombre: 'Ginecología' },
      { nombre: 'Oftalmología' },
      { nombre: 'Ortopedia' },
      { nombre: 'Endocrinología' },
      { nombre: 'Gastroenterología' }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Especialidades', null, {});
  }
};
