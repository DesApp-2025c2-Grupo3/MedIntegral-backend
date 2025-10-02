'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Provincia extends Model {
    static associate(models) {
      Provincia.hasOne(models.Direccion, {
        foreignKey: 'provinciaId'
      });
    }
  }
  Provincia.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Provincia',
  });
  return Provincia;
};