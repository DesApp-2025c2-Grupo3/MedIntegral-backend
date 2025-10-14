'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Dias',
      [
        { nombre: 'Lunes' },
        { nombre: 'Martes' },
        { nombre: 'Miércoles' },
        { nombre: 'Jueves' },
        { nombre: 'Viernes' },
        { nombre: 'Sábado' },
        { nombre: 'Domingo' }
      ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Dias', null, {});
  }
};
