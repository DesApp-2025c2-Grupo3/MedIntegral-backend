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
        as: 'CentrosDeAtencion',
        foreignKey: 'lugarAtencionId'
      });
    }
  }
  HorarioAtencion.init({
    horaInicio: DataTypes.STRING,
    horaFin: DataTypes.STRING,
    duracionTurno: DataTypes.INTEGER,
    dia: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'HorarioAtencion',
    tableName: 'HorariosAtencion',
    freezeTableName: true
  });
  return HorarioAtencion;
};