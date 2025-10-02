'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profesional extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Profesional.belongsTo(models.CentroMedico, {
        foreignKey: 'centroMedicoId'
      });
      Profesional.belongsTo(models.Prestador, {
        foreignKey: 'prestadorId'
      });
    }
  }
  Profesional.init({
    matricula: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profesional',
  });
  return Profesional;
};