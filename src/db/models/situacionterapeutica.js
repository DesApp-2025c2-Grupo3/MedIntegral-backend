'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SituacionTerapeutica extends Model {
    static associate(models) {
    }
  }
  SituacionTerapeutica.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SituacionTerapeutica',
  });
  return SituacionTerapeutica;
};