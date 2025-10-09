'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LugarAtencion extends Model {
    static associate(models) {
      LugarAtencion.hasMany(models.AgendaTurnos, {
        foreignKey: 'lugarAtencionId'
      });
      LugarAtencion.belongsTo(models.Prestador, {
        foreignKey: 'prestadorId'
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