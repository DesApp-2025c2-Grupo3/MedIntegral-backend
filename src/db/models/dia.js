'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dia extends Model {
    static associate(models) {
      Dia.belongsToMany(models.HorarioAtencion, {
        through: "DiaHorarioAtencion", // tabla intermedia
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