'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dia extends Model {
    static associate(models) {
      Dia.belongsToMany(models.HorarioAtencion, {
        through: "HorarioAtencionDia",
        foreignKey: 'diaId',
        otherKey: 'horarioAtencionId'
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