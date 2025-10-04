'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Prestador extends Model {
    static associate(models) {
      Prestador.belongsTo(models.AgendaTurnos, {
        foreignKey: 'agendaTurnosId'
      });
      Prestador.hasMany(models.Email, {
        foreignKey: 'prestadorId'
      });
      Prestador.hasMany(models.Telefono, {
        foreignKey: 'prestadorId'
      });
      Prestador.belongsToMany(models.Especialidad, {
        through: "PrestadorEspecialidad", // tabla intermedia
        foreignKey: 'EspecialidadId'
      });
      Prestador.hasMany(models.Direccion, {
        foreignKey: 'prestadorId'
      });
      Prestador.hasOne(models.CentroMedico, {
        foreignKey: 'prestadorId'
      });
      Prestador.hasOne(models.Profesional, {
        foreignKey: 'prestadorId'
      });
    }
  }
  Prestador.init({
    nombre: DataTypes.STRING,
    cuilCuit: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Prestador',
  });
  return Prestador;
};