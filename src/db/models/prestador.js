'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Prestador extends Model {
    static associate(models) {
      Prestador.hasMany(models.AgendaTurnos, {
        foreignKey: 'prestadorId'
      });
      Prestador.hasMany(models.Email, {
        foreignKey: 'prestadorId'
      });
      Prestador.hasMany(models.Telefono, {
        foreignKey: 'prestadorId'
      });
      Prestador.belongsToMany(models.Especialidad, {
        through: "PrestadorEspecialidad", // tabla intermedia
        foreignKey: 'EspecialidadId'
      });
      Prestador.hasMany(models.Direccion, {
        foreignKey: 'prestadorId'
      });

      Prestador.hasMany(models.Prestador, {
        foreignKey: 'prestadorId'
      });
      Prestador.belongsTo(models.Prestador, {
        foreignKey: 'prestadorId',
        allowNull: true,
      });

    }
  }
  Prestador.init({
    nombre: DataTypes.STRING,
    cuilCuit: DataTypes.INTEGER,
    esCentroMedico: DataTypes.BOOLEAN,
    integraCentroMedico: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Prestador',
    tableName: 'Prestadores',
    freezeTableName: true
  });
  return Prestador;
};