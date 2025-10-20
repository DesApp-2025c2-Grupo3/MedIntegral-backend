"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "TipoDocumentos",
      [
        {
          relacion: "DNI",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          relacion: "Pasaporte",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          relacion: "Libreta cívica",
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
