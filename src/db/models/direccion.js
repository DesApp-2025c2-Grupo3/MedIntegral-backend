'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Direccion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Direccion.hasOne(models.Provincia, {
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