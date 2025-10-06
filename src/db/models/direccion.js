'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Direccion extends Model {
    static associate(models) {
      Direccion.belongsTo(models.Provincia, {
        foreignKey: 'provinciaId'
      });
      Direccion.hasOne(models.LugarAtencion, {
        foreignKey: 'direccionId'
      });
    }
  }
  Direccion.init({
    calle: DataTypes.STRING,
    altura: DataTypes.INTEGER,
    pisoDepto: DataTypes.STRING,
    codigoPostal: DataTypes.STRING,
    localidad: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Direccion',
  });
  return Direccion;
};