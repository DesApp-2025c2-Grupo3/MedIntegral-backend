'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LugarAtencion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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