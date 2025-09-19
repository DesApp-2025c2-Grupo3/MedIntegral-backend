'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HorarioAtencion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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