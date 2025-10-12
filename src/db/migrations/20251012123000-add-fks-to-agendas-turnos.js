"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('AgendasTurnos', 'prestadorId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'Prestadores', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addColumn('AgendasTurnos', 'especialidadId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'Especialidades', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addColumn('AgendasTurnos', 'lugarAtencionId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'LugaresAtencion', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('AgendasTurnos', 'lugarAtencionId');
    await queryInterface.removeColumn('AgendasTurnos', 'especialidadId');
    await queryInterface.removeColumn('AgendasTurnos', 'prestadorId');
  }
};
