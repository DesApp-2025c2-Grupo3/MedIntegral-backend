'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Provincia extends Model {
    static associate(models) {
      Provincia.belongsTo(models.Direccion, {
        foreignKey: 'direccionId'
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