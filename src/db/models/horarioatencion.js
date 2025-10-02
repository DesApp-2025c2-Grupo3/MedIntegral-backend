'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HorarioAtencion extends Model {
    static associate(models) {
      HorarioAtencion.hasMany(models.AgendaTurnos, {
        foreignKey: 'horarioAtencionId'
      });
      HorarioAtencion.hasMany(models.LugarAtencion, {
        foreignKey: 'horarioAtencionId'
      });
    }
  }
  HorarioAtencion.init({
    horaInicio: DataTypes.INTEGER,
    horaFin: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'HorarioAtencion',
  });
  return HorarioAtencion;
};