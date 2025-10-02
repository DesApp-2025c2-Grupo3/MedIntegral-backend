'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profesional extends Model {
    static associate(models) {
      Profesional.belongsTo(models.CentroMedico, {
        foreignKey: 'centroMedicoId'
      });
      Profesional.belongsTo(models.Prestador, {
        foreignKey: 'prestadorId'
      });
    }
  }
  Profesional.init({
    matricula: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profesional',
  });
  return Profesional;
};