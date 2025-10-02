'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Telefono extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Telefono.hasOne(models.Prestador, {
        foreignKey: 'telefonoId'
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