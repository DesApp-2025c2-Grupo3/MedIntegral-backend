"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SituacionTerapeutica extends Model {
    static associate(models) {
      SituacionTerapeutica.belongsToMany(models.Afiliado, {
        through: "AfiliadoSituaciones",
        foreignKey: "situacionTerapeuticaId",
      });
    }
  }
  SituacionTerapeutica.init(
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SituacionTerapeutica",
    }
  );
  return SituacionTerapeutica;
};
