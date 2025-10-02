'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Especialidad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Especialidad.hasOne(models.AgendaTurnos, {
        foreignKey: 'especialidadId'
      });
      Especialidad.hasOne(models.Prestador, {
        foreignKey: 'especialidadId'
      });
    }
  }
  Especialidad.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Especialidad',
  });
  return Especialidad;
};