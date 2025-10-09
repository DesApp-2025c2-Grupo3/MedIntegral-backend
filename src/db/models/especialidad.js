'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Especialidad extends Model {
    static associate(models) {
      Especialidad.hasMany(models.AgendaTurnos, {
        foreignKey: 'especialidadId'
      });
      Especialidad.belongsToMany(models.Prestador, {
        through: "PrestadorEspecialidad", // tabla intermedia
        foreignKey: 'prestadorId'
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