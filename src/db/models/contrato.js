"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Contrato extends Model {
    static associate(models) {
      Contrato.belongsTo(models.PlanMedico, {
        foreignKey: "planId",
        as: "plan",
      });

      Contrato.hasMany(models.Afiliado, {
        foreignKey: "contratoId",
        as: "afiliados",
      });
    }
  }
  Contrato.init(
    {
      planId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      nAfiliado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      },
    },
    {
      sequelize,
      modelName: "Contrato",
    }
  );
  return Contrato;
};
