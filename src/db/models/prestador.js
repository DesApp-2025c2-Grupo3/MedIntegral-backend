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
        foreignKey: 'propietarioId', //acá guardamos la FK
        constraints: false, // Hay que desactivar las constraints porque te obliga a que exista el Id en UNA tabla, y nosotros podemos apuntar a dos diferentes
        scope: {
          propietarioTipo: 'Prestador' // Sequelize autocompletará este campo
        }
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
    cuilCuit: DataTypes.STRING,
    esCentroMedico: DataTypes.BOOLEAN,
    integraCentroMedico: DataTypes.BOOLEAN,
    centroMedicoId: {
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