'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Especialidades', [
  { nombre: 'Cardiología' },
  { nombre: 'Dermatología' },
  { nombre: 'Neurología' },
  { nombre: 'Pediatría' },
  { nombre: 'Psiquiatría' },
  { nombre: 'Ginecología' },
  { nombre: 'Oftalmología' },
  { nombre: 'Ortopedia' },
  { nombre: 'Endocrinología' },
  { nombre: 'Gastroenterología' },
  { nombre: 'Traumatología' },
  { nombre: 'Urología' },
  { nombre: 'Nefrología' },
  { nombre: 'Hematología' },
  { nombre: 'Oncología' },
  { nombre: 'Reumatología' },
  { nombre: 'Otorrinolaringología' },
  { nombre: 'Neumonología' },
  { nombre: 'Infectología' },
  { nombre: 'Alergología' },
  { nombre: 'Inmunología' },
  { nombre: 'Cirugía General' },
  { nombre: 'Cirugía Plástica' },
  { nombre: 'Cirugía Vascular' },
  { nombre: 'Cirugía Pediátrica' },
  { nombre: 'Cirugía Maxilofacial' },
  { nombre: 'Medicina General' },
  { nombre: 'Medicina Interna' },
  { nombre: 'Medicina del Deporte' },
  { nombre: 'Medicina Laboral' },
  { nombre: 'Medicina Familiar' },
  { nombre: 'Nutrición' },
  { nombre: 'Fonoaudiología' },
  { nombre: 'Kinesiología' },
  { nombre: 'Terapia Intensiva' },
  { nombre: 'Terapia Ocupacional' },
  { nombre: 'Tocoginecología' },
  { nombre: 'Neonatología' },
  { nombre: 'Gerontología' },
  { nombre: 'Anestesiología' },
  { nombre: 'Radiología' },
  { nombre: 'Imagenología' },
  { nombre: 'Patología' },
  { nombre: 'Genética Médica' },
  { nombre: 'Hepatología' },
  { nombre: 'Proctología' },
  { nombre: 'Fisiatría' },
  { nombre: 'Adicciones' },
  { nombre: 'Dolor y Cuidados Paliativos' }
], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Especialidades', null, {});
  }
};
