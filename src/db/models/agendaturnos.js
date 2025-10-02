'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AgendaTurnos extends Model {
    static associate(models) {
      AgendaTurnos.belongsTo(models.Especialidad, {
        foreignKey: 'especialidadId'
      });
      AgendaTurnos.belongsTo(models.Prestador, {
        foreignKey: 'prestadorId'
      });
      AgendaTurnos.belongsTo(models.LugarAtencion, {
        foreignKey: 'lugarAtencionId'
      });
      AgendaTurnos.belongsTo(models.HorarioAtencion, {
        foreignKey: 'horarioAtencionId'
      });
    }
  }
  AgendaTurnos.init({
    duracion: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AgendaTurnos',
  });
  return AgendaTurnos;
};