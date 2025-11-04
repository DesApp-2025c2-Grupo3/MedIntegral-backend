"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Afiliado extends Model {
    static associate(models) {
      Afiliado.belongsTo(models.Afiliado, {
        foreignKey: "titularId",
        as: "titular",
      });

      Afiliado.hasMany(models.Afiliado, {
        foreignKey: "titularId",
        as: "dependientes",
      });

      Afiliado.belongsTo(models.Contrato, {
        foreignKey: "contratoId",
      });

      Afiliado.belongsTo(models.TipoDocumento, {
        foreignKey: "tipoDocumentoId",
        as: "tipoDocumento",
      });

      Afiliado.belongsTo(models.Parentesco, {
        foreignKey: "parentescoId",
        as: "parentesco",
      });

      Afiliado.hasMany(models.Telefono, {
        foreignKey: "propietarioId",
        constraints: false,
        scope: {
          propietarioTipo: "Afiliado",
        },
        as: "telefonos",
      });

      Afiliado.hasMany(models.Email, {
        foreignKey: "propietarioId",
        constraints: false,
        scope: {
          propietarioTipo: "Afiliado",
        },
        as: "emails",
      });

      Afiliado.hasMany(models.Domicilio, {
        //nueva entidad que se relaciona con la dirección
        foreignKey: "afiliadoId",
        as: "domicilios",
      });

      Afiliado.belongsToMany(models.SituacionTerapeutica, {
        through: "AfiliadoSituaciones",
        foreignKey: "afiliadoId",
        as: "situacionesTerapeuticas",
      });
    }
  }

  Afiliado.init(
    {
      nIntegrante: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tipoDocumentoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      numeroDocumento: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      fechaNacimiento: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      apellido: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vigenciaInicio: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      vigenciaFin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      titularId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      contratoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      parentescoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Afiliado",
      tableName: "Afiliados",
    }
  );
  return Afiliado;
};
