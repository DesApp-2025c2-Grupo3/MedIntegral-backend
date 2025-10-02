'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Dia.hasOne(models.HorarioAtencion, {
        foreignKey: 'diaId'
      });
    }
  }
  Dia.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Dia',
  });
  return Dia;
};