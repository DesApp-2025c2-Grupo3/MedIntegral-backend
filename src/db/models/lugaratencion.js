'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LugarAtencion extends Model {
    static associate(models) {
      LugarAtencion.hasMany(models.AgendaTurnos, {
        as: 'AgendasTurnos',
        foreignKey: 'lugarAtencionId'
      });
      LugarAtencion.belongsTo(models.Prestador, {
        as: 'Prestador',
        foreignKey: 'prestadorId'
      });
      LugarAtencion.belongsTo(models.Direccion, {
        as: 'Direccion',
        foreignKey: 'direccionId'
      });
      LugarAtencion.hasMany(models.HorarioAtencion, {
        as: 'Horarios',
        foreignKey: 'lugarAtencionId'
      });
    }
  }
  LugarAtencion.init({
    direccionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LugarAtencion',
    tableName: 'LugaresAtencion',
    freezeTableName: true
  });
  return LugarAtencion;
};