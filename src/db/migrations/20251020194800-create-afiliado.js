'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Afiliados', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nIntegrante: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tipoDocumentoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      numeroDocumento: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fechaNacimiento: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      apellido: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      vigenciaInicio: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      vigenciaFin: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      titularId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      contratoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      parentescoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('Afiliados');
  }
};