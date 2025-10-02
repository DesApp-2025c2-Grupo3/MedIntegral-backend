'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Email extends Model {
    static associate(models) {
      Email.hasOne(models.Prestador, {
        foreignKey: 'emailId'
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