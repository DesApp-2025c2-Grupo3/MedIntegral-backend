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

      /*
      Afiliado.belongsTo(models.GrupoFamiliar, {
        foreignKey: "grupoFamiliarId",
      });
      */

      Afiliado.belongsTo(models.TipoDocumento, {
        foreignKey: "tipoDocumentoId",
      });

      Afiliado.belongsTo(models.Parentesco, {
        foreignKey: "parentescoId",
      });

      Afiliado.belongsTo(models.PlanMedico, {
        foreignKey: "planMedicoId",
      });

      Afiliado.hasMany(models.Telefono, {
        foreignKey: "afiliadoId",
        constraints: false,
        scope: {
          propietarioTipo: "Afiliado",
        },
      });

      Afiliado.hasMany(models.Email, {
        foreignKey: "afiliadoId",
        constraints: false,
        scope: {
          propietarioTipo: "Afiliado",
        },
      });

      Afiliado.hasMany(models.Domicilio, {
        //nueva entidad que se relaciona con la dirección
        foreignKey: "afiliadoId",
      });

      Afiliado.belongsToMany(models.SituacionTerapeutica, {
        through: "AfiliadoSituaciones",
        foreignKey: "afiliadoId",
      });
    }
  }

  Afiliado.init(
    {
      nAfiliado: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nIntegrante: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tipoDocumento: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      numeroDocumento: {
        type: DataTypes.STRING,
        allowNull: false,
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
      grupoFamiliarId: {
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
