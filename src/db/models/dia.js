'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dia extends Model {
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