"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "TipoDocumentos",
      [
        {
          tipo: "DNI",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tipo: "Pasaporte",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tipo: "Libreta cívica",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("TipoDocumentos", null, {});
  },
};
