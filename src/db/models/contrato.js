"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Contrato extends Model {
    static associate(models) {
      Contrato.belongsTo(models.PlanMedico, {
        foreignKey: "planId",
      });

      Contrato.hasMany(models.Afiliado, {
        foreignKey: "contratoId",
      });
    }
  }
  Contrato.init(
    {
      planId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nAfiliado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true
      },
    },
    {
      sequelize,
      modelName: "Contrato",
    }
  );
  return Contrato;
};
