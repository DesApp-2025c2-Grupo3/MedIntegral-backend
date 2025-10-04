'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LugarAtencion extends Model {
    static associate(models) {
      LugarAtencion.belongsTo(models.AgendaTurnos, {
        foreignKey: 'agendaTurnosId'
      });
      LugarAtencion.hasMany(models.Prestador, {
        foreignKey: 'lugarAtencionId'
      });
      LugarAtencion.belongsTo(models.Direccion, {
        foreignKey: 'direccionId'
      });
      LugarAtencion.hasMany(models.HorarioAtencion, {
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