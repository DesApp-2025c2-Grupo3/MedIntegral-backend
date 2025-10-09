'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Telefono extends Model {
    static associate(models) {
      Telefono.belongsTo(models.Prestador, {
        foreignKey: 'prestadorId'
      });
    }
  }
  Telefono.init({
    numero: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Telefono',
  });
  return Telefono;
};