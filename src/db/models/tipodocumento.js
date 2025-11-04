"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TipoDocumento extends Model {
    static associate(models) {
      TipoDocumento.hasMany(models.Afiliado, {
        foreignKey: "tipoDocumentoId",
      });
    }
  }
  TipoDocumento.init(
    {
      tipo: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "TipoDocumento",
    }
  );
  return TipoDocumento;
};
