'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Provincia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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