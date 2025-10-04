'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HorarioAtencion extends Model {
    static associate(models) {
      HorarioAtencion.belongsTo(models.AgendaTurnos, {
        foreignKey: 'agendaTurnosId'
      });
      HorarioAtencion.belongsTo(models.LugarAtencion, {
        foreignKey: 'lugarAtencionId'
      });
      HorarioAtencion.belongsToMany(models.Dia, { 
        through: "DiaHorarioAtencion", // tabla intermedia
        foreignKey: 'horarioAtencionId'
      });
    }
  }
  HorarioAtencion.init({
    horaInicio: DataTypes.INTEGER,
    horaFin: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'HorarioAtencion',
  });
  return HorarioAtencion;
};