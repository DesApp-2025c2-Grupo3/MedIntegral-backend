'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AgendaTurnos extends Model {
    static associate(models) {
      AgendaTurnos.belongsTo(models.Especialidad, {
        as: "Especialidad",
        foreignKey: 'especialidadId'
      });
      AgendaTurnos.belongsTo(models.Prestador, {
        as: "Prestador",
        foreignKey: 'prestadorId'
      });
      AgendaTurnos.belongsTo(models.LugarAtencion, {
        as: 'CentroDeAtencion',
        foreignKey: 'lugarAtencionId'
      });
      AgendaTurnos.hasMany(models.HorarioAtencion, {
        as: 'Horarios',
        foreignKey: 'agendaTurnosId'
      });
    }
  }
  AgendaTurnos.init({
    
  }, {
    sequelize,
    modelName: 'AgendaTurnos',
    tableName: 'AgendasTurnos',
    freezeTableName: true
  });
  return AgendaTurnos;
};