const { generarProximoNAfiliado } = require("../services/contratoService");
const { TipoDocumento, PlanMedico, Provincia } = require("../db/models");

const {
  Contrato,
  Afiliado,
  Email,
  Telefono,
  Direccion,
  Domicilio,
  AfiliadoSituaciones,
  SituacionTerapeutica,
} = require("../db/models");

const crearAfiliado = async (req, res) => {
  const {
    tipoDocumentoId,
    numeroDocumento,
    fechaNacimiento,
    nombre,
    apellido,
    planId,
    vigenciaInicio,
    vigenciaFin,
    tieneGrupoFamiliar,
    grupoFamiliar = [],
    emails = [],
    telefonos = [],
    direcciones = [],
    tieneSituacionTerapeutica,
    situacionesTerapeuticas = [],
  } = req.body;

  const nAfiliado = await generarProximoNAfiliado();

  const nuevoContrato = await Contrato.create({
    planId: planId,
    nAfiliado: nAfiliado
  });

  const nuevoContratoId = nuevoContrato.id;

  const titular = await Afiliado.create({
    tipoDocumentoId,
    numeroDocumento,
    fechaNacimiento,
    nombre,
    apellido,
    vigenciaInicio,
    vigenciaFin,
    nIntegrante: 1,
    contratoId: nuevoContratoId,
    titularId: null,
    parentescoId: 1,
  });

  await crearEmails(emails, titular.id);
  await crearTelefonos(telefonos, titular.id);
  await crearDirecciones(direcciones, titular.id);

  if (tieneSituacionTerapeutica) {
    await crearSituacionesTerapeuticas(situacionesTerapeuticas, titular.id);
  }

  if (tieneGrupoFamiliar) {
    let nIntegrante = 2;

    for (const miembro of grupoFamiliar) {
      const nuevoMiembro = await Afiliado.create({
        tipoDocumentoId: miembro.tipoDocumento.id,
        numeroDocumento: miembro.numeroDocumento,
        fechaNacimiento: miembro.fechaNacimiento,
        nombre: miembro.nombre,
        apellido: miembro.apellido,
        vigenciaInicio: miembro.vigenciaInicio,
        vigenciaFin: miembro.vigenciaFin,
        nIntegrante: nIntegrante,
        contratoId: nuevoContratoId,
        titularId: titular.id,
        parentescoId: miembro.parentesco.id,
      });

      nIntegrante++;

      await crearEmails(miembro.emails, nuevoMiembro.id);
      await crearTelefonos(miembro.telefonos, nuevoMiembro.id);
      await crearDirecciones(miembro.direcciones, nuevoMiembro.id);

      if (miembro.tieneSituacionTerapeutica) {
        await crearSituacionesTerapeuticas(
          miembro.situacionesTerapeuticas,
          nuevoMiembro.id
        );
      }
    }
  }

  res.status(201).json(titular.id);
};


const obtenerTitulares = async (_, res) => {
  const titulares = await Afiliado.findAll({
    where: { // Solo titulares
      titularId: null,
    },
    attributes: [
      "id",
      "nombre",
      "apellido",
      "vigenciaInicio",
      "numeroDocumento",
    ],
    include: [
      {
        model: Contrato,
        attributes: ["nAfiliado"],
        include: {
          model: PlanMedico,
          as: "plan", // Asumo que esta sí tiene alias en el modelo Contrato
          attributes: ["plan"],
        },
      },
      {
        model: TipoDocumento,
        as: "tipoDocumento",
        attributes: ["tipo"],
      },
      {
        model: Email,
        as: "emails",
        attributes: ["direccion"],
      },
      {
        model: Telefono,
        as: "telefonos",
        attributes: ["numero"],
      },
      {
        model: Domicilio, //Entramos por domicilio
        as: "domicilios",
        attributes: { exclude: ["createdAt", "updatedAt", "afiliadoId", "direccionId"] },
        include: {
          model: Direccion, // Y dentro de Domicilio, incluyo Direccion
          attributes: { exclude: ["createdAt", "updatedAt", "provinciaId"] },
          include: {
            model: Provincia,
            attributes: ["nombre"]
        }
        }
      },
    ],
    order: [["id", "ASC"]],
  });


  res.status(200).json(titulares);
};

// Helpers (ya que sino el código se repetiria para titular y miembros) -> pasarlo a services ?
const crearEmails = async (emails, afiliadoId) => {
  const datosEmails = emails.map((e) => ({
    direccion: e.direccion,
    propietarioId: afiliadoId,
    propietarioTipo: "Afiliado",
  }));
  await Email.bulkCreate(datosEmails);
};

const crearTelefonos = async (telefonos, afiliadoId) => {
  const datosTelefonos = telefonos.map((t) => ({
    numero: t.numero,
    propietarioId: afiliadoId,
    propietarioTipo: "Afiliado",
  }));
  await Telefono.bulkCreate(datosTelefonos);
};

const crearDirecciones = async (direcciones, afiliadoId) => {
  for (const direccionData of direcciones) {
    const [direccion] = await Direccion.findOrCreate({
      where: {
        calle: direccionData.calle,
        altura: direccionData.altura,
        pisoDepto: direccionData.pisoDepto,
        localidad: direccionData.localidad,
        codigoPostal: direccionData.codigoPostal,
      },
      defaults: direccionData,
    });

    await Domicilio.create({
      afiliadoId: afiliadoId,
      direccionId: direccion.id,
    });
  }
};

const crearSituacionesTerapeuticas = async (
  situacionesTerapeuticas,
  afiliadoId
) => {
  for (const sit of situacionesTerapeuticas) {
    const situacion = await SituacionTerapeutica.findByPk(sit.situacionId);
    if (situacion) {
      await AfiliadoSituaciones.create({
        afiliadoId: afiliadoId,
        situacionTerapeuticaId: sit.situacionId,
        fechaInicio: sit.fechaInicio,
        fechaFin: sit.fechaFin,
      });
    }
  }
};

module.exports = {
  crearAfiliado,
  obtenerTitulares,
};
