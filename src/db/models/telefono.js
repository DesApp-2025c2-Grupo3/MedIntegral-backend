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
    numero: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Telefono',
    tableName: 'Telefonos',
    freezeTableName: true
  });
  return Telefono;
};