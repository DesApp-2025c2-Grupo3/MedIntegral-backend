const { generarProximoNAfiliado } = require("../services/contratoService");
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
    coberturaId,
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
    planId: coberturaId,
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

  const titularId = titular.id;

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
        titularId: titularId,
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
};
