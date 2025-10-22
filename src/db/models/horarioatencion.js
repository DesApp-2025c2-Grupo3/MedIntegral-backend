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
        through: "HorarioAtencionDia",
        foreignKey: 'horarioAtencionId', // <- este es el correcto
        otherKey: 'diaId'
      });

    }
  }
  HorarioAtencion.init({
    horaInicio: DataTypes.STRING,
    horaFin: DataTypes.STRING,
    duracionTurno: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'HorarioAtencion',
    tableName: 'HorariosAtencion',
    freezeTableName: true
  });
  return HorarioAtencion;
};