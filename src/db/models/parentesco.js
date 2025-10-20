'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Parentesco extends Model {
    static associate(models) {
      Parentesco.hasMany(models.Afiliado, {
        foreignKey: 'afiliadoId'
      });
    }
  }
  Parentesco.init({
    relacion: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Parentesco',
  });
  return Parentesco;
};