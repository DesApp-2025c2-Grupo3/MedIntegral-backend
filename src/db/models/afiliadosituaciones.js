"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AfiliadoSituaciones extends Model {
    static associate(models) {
      AfiliadoSituaciones.belongsTo(models.Afiliado, {
        foreignKey: "afiliadoId",
      });
      AfiliadoSituaciones.belongsTo(models.SituacionTerapeutica, {
        foreignKey: "situacionTerapeuticaId",
      });
    }
  }
  AfiliadoSituaciones.init(
    {
      afiliadoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Afiliados",
          key: "id",
        },
      },
      situacionTerapeuticaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "SituacionTerapeuticas",
          key: "id",
        },
      },
      fechaInicio: DataTypes.DATE,
      fechaFin: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "AfiliadoSituaciones",
    }
  );
  return AfiliadoSituaciones;
};
