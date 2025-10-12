'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Provincias',
      [
        { nombre: 'Buenos Aires' },
        { nombre: 'Catamarca' },
        { nombre: 'Chaco' },
        { nombre: 'Chubut' },
        { nombre: 'Córdoba' },
        { nombre: 'Corrientes' },
        { nombre: 'Entre Ríos' },
        { nombre: 'Formosa' },
        { nombre: 'Jujuy' },
        { nombre: 'La Pampa' },
        { nombre: 'La Rioja' },
        { nombre: 'Mendoza' },
        { nombre: 'Misiones' },
        { nombre: 'Neuquén' },
        { nombre: 'Río Negro' },
        { nombre: 'Salta' },
        { nombre: 'San Juan' },
        { nombre: 'San Luis' },
        { nombre: 'Santa Cruz' },
        { nombre: 'Santa Fe' },
        { nombre: 'Santiago del Estero' },
        { nombre: 'Tierra del Fuego' },
        { nombre: 'Tucumán' },
        { nombre: 'Ciudad Autónoma de Buenos Aires' }
      ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Provincias', null, {});
  }
};