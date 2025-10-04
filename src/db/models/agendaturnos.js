'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AgendaTurnos extends Model {
    static associate(models) {
      AgendaTurnos.hasOne(models.Especialidad, {
        foreignKey: 'agendaTurnosId'
      });
      AgendaTurnos.hasOne(models.Prestador, {
        foreignKey: 'agendaTurnosId'
      });
      AgendaTurnos.hasOne(models.LugarAtencion, {
        foreignKey: 'agendaTurnosId'
      });
      AgendaTurnos.hasMany(models.HorarioAtencion, {
        foreignKey: 'agendaTurnosId'
      });
    }
  }
  AgendaTurnos.init({
    duracion: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AgendaTurnos',
  });
  return AgendaTurnos;
};