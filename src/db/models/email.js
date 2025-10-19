'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Email extends Model {
    // La asociación la vamos a def en los modelos dueños (Prestador, Afiliado)
    // por lo que este método associate puede quedar vacío.
    static associate(models) {
    }
  }
  Email.init({
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Columna para guardar el ID del modelo dueño (Prestador o Afiliado)
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
    modelName: 'Email',
    tableName: 'Emails',
    freezeTableName: true
  });
  return Email;
};