'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Prestadores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING
      },
      cuilCuit: {
        type: Sequelize.INTEGER
      },
      esCentroMedico:{
        type: Sequelize.BOOLEAN
      },
      integraCentroMedico:{
        type: Sequelize.BOOLEAN
      },
      centroMedicoId:{
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Prestadores', // Se referencia a sí misma
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.dropTable('Prestadores');
  }
};

