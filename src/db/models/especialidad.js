'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Especialidad extends Model {
    static associate(models) {
      Especialidad.hasOne(models.AgendaTurnos, {
        foreignKey: 'especialidadId'
      });
      Especialidad.hasOne(models.Prestador, {
        foreignKey: 'especialidadId'
      });
    }
  }
  Especialidad.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Especialidad',
  });
  return Especialidad;
};