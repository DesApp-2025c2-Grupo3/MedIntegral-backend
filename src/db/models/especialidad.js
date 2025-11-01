'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Especialidad extends Model {
    static associate(models) {
      Especialidad.hasMany(models.AgendaTurnos, {
        foreignKey: 'especialidadId'
      });
      Especialidad.belongsToMany(models.Prestador, {
        through: "PrestadorEspecialidad", // tabla intermedia
        as: 'Prestadores',
        foreignKey: 'prestadorId'
      });
    }
  }
  Especialidad.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Especialidad',
    tableName: 'Especialidades',
    freezeTableName: true,
    timestamps: false
  });
  return Especialidad;
};