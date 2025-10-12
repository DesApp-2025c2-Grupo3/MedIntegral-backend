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
      Prestador.hasMany(models.LugarAtencion, {
        foreignKey: 'prestadorId'
      });

    }
  }
  Prestador.init({
    nombre: DataTypes.STRING,
    cuilCuit: DataTypes.BIGINT,
    esCentroMedico: DataTypes.BOOLEAN,
    integraCentroMedico: DataTypes.BOOLEAN,
    centroMedicoId:{
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Prestadores', // Se referencia a sí misma
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  }, {
    sequelize,
    modelName: 'Prestador',
    tableName: 'Prestadores',
    freezeTableName: true
  });
  return Prestador;
};