"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Domicilio extends Model {
    static associate(models) {
      Domicilio.belongsTo(models.Direccion, {
        foreignKey: "direccionId",
      });
      // Un Domicilio pertenece a un Afiliado
      Domicilio.belongsTo(models.Afiliado, {
        foreignKey: "afiliadoId",
      });
    }
  }
  Domicilio.init(
    {
      afiliadoId: DataTypes.INTEGER,
      direccionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Domicilio",
    }
  );
  return Domicilio;
};
