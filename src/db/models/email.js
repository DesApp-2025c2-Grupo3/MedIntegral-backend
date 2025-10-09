'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Email extends Model {
    static associate(models) {
      Email.belongsTo(models.Prestador, {
        foreignKey: 'prestadorId'
      });
    }
  }
  Email.init({
    direccion: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Email',
  });
  return Email;
};