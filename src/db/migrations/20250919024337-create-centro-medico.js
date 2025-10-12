// 'use strict';
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.addColumn('Prestadores', 'centroMedicoId', {
//       type: Sequelize.INTEGER,
//       allowNull: true, // Permite que sea nulo (un centro médico no pertenece a nadie)
//       references: {
//         model: 'Prestadores', // Se referencia a sí misma
//         key: 'id'
//       },
//       onUpdate: 'CASCADE',
//       onDelete: 'SET NULL'
//     });
//   },
//   async down(queryInterface, Sequelize) {
//     await queryInterface.removeColumn('Prestadores', 'centroMedicoId');
//   }
// };