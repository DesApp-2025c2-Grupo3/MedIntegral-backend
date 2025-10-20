'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlanMedico extends Model {
    static associate(models) {
    }
  }
  PlanMedico.init({
    plan: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PlanMedico',
  });
  return PlanMedico;
};