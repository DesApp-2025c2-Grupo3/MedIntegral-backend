"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Direccion extends Model {
    static associate(models) {
      Direccion.belongsTo(models.Provincia, {
        as: "Provincia",
        foreignKey: "provinciaId",
      });
      Direccion.hasOne(models.LugarAtencion, {
        as: "CentroDeAtencion",
        foreignKey: "direccionId",
      });
      Direccion.hasOne(models.Domicilio, {
        foreignKey: "direccionId",
      });
    }
  }
  Direccion.init(
    {
      calle: DataTypes.STRING,
      altura: DataTypes.INTEGER,
      pisoDepto: DataTypes.STRING,
      codigoPostal: DataTypes.STRING,
      localidad: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Direccion",
      tableName: "Direcciones",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Direccion;
};
