"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "SituacionTerapeuticas",
      [
        {
          nombre: "Diabetes tipo 1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Diabetes tipo 2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Hipertensión Arterial",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Enfermedad Celíaca",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Embarazo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Tratamiento Oncológico",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Insuficiencia Renal Crónica",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Discapacidad Certificada (CUD)",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Trasplante de Órgano",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "VIH/SIDA",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Patología de Columna",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Asma Severa",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SituacionesTerapeuticas', null, {});
  },
};
