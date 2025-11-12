'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HorariosAtencion', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      horaInicio: {
        type: Sequelize.STRING
      },
      horaFin: {
        type: Sequelize.STRING
      },
      duracionTurno: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      dia: {
        type: Sequelize.STRING
      },
      disponible: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('HorariosAtencion');
  }
};