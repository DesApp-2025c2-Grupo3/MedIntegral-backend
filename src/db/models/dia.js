'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dia extends Model {
    static associate(models) {
      Dia.belongsToMany(models.HorarioAtencion, {
        through: "HorarioAtencionDia", // tabla intermedia
        foreignKey: 'horarioAtencionId'
      });
    }
  }
  Dia.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Dia',
    tableName: 'Dias',
    freezeTableName: true,
    timestamps: false
  });
  return Dia;
};