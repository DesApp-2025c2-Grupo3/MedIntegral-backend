"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AfiliadoSituaciones", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      afiliadoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Afiliados",
          key: "id",
        },
      },
      situacionTerapeuticaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "SituacionTerapeuticas",
          key: "id",
        },
      },
      fechaInicio: {
        type: Sequelize.DATE,
      },
      fechaFin: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("AfiliadoSituaciones");
  },
};
