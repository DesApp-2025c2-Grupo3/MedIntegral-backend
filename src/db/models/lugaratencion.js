'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LugarAtencion extends Model {
    static associate(models) {
      LugarAtencion.hasOne(models.AgendaTurnos, {
        foreignKey: 'lugarAtencionId'
      });
      LugarAtencion.hasMany(models.Prestador, {
        foreignKey: 'lugarAtencionId'
      });
    }
  }
  LugarAtencion.init({
    direccionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LugarAtencion',
  });
  return LugarAtencion;
};