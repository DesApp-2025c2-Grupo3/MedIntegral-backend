'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Telefono extends Model {
    static associate(models) {
    }
  }
  Telefono.init({
    numero: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    propietarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Columna para guardar el nombre del modelo dueño (Prestador o Afiliado)
    propietarioTipo: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Telefono',
    tableName: 'Telefonos',
    freezeTableName: true
  });
  return Telefono;
};