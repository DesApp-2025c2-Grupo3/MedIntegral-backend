'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CentroMedico extends Model {
    static associate(models) {
      CentroMedico.hasMany(models.Profesional, {
        foreignKey: 'centroMedicoId'
      });
      CentroMedico.belongsTo(models.Prestador, {
        foreignKey: 'prestadorId'
      });
    }
  }
  CentroMedico.init({
    prestadorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CentroMedico',
  });
  return CentroMedico;
};