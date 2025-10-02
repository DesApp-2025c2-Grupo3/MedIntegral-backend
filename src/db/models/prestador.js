'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Prestador extends Model {
    static associate(models) {
      Prestador.hasOne(models.AgendaTurnos, {
        foreignKey: 'prestadorId'
      });
      Prestador.belongsTo(models.Email, {
        foreignKey: 'emailId'
      });
      Prestador.belongsTo(models.Telefono, {
        foreignKey: 'telefonoId'
      });
      Prestador.belongsTo(models.Especialidad, {
        foreignKey: 'especialidadId'
      });
      Prestador.belongsTo(models.Direccion, {
        foreignKey: 'direccionId'
      });
      Prestador.hasOne(models.CentroMedico, {
        foreignKey: 'prestadorId'
      });
      Prestador.hasOne(models.Profesional, {
        foreignKey: 'prestadorId'
      });
    }
  }
  Prestador.init({
    nombre: DataTypes.STRING,
    cuilCuit: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Prestador',
  });
  return Prestador;
};