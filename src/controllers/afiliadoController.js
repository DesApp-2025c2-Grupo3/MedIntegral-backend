const { Op } = require("sequelize");
const { generarProximoNAfiliado } = require("../services/contratoService");
const { capitalizarCadena } = require("../services/capitalizarCadena");

const {
  TipoDocumento,
  PlanMedico,
  Provincia,
  Parentesco,
} = require("../db/models");

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

const includeAfiliadoCompleto = () => [
  {
    model: Contrato,
    attributes: ["nAfiliado"],
    include: {
      model: PlanMedico,
      as: "plan",
      attributes: ["plan"],
    },
  },
  {
    model: TipoDocumento,
    as: "tipoDocumento",
    attributes: ["tipo"],
  },
  {
    model: Parentesco,
    as: "parentesco",
    attributes: ["relacion"],
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
    model: Domicilio,
    as: "domicilios",
    attributes: { exclude: ["createdAt", "updatedAt", "afiliadoId", "direccionId"] },
    include: {
      model: Direccion,
      attributes: { exclude: ["createdAt", "updatedAt", "provinciaId"] },
      include: {
        model: Provincia,
        as: "Provincia",
        attributes: ["nombre"],
      },
    },
  },
  {
    model: SituacionTerapeutica,
    as: "situacionesTerapeuticas",
    attributes: ["nombre"],
    through: {
      model: AfiliadoSituaciones,
      attributes: ["fechaInicio", "fechaFin"],
    },
  },
];

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

  const capitalizedNombre = await capitalizarCadena(nombre);
  const capitalizedApellido = await capitalizarCadena(apellido);

  const nuevoContrato = await Contrato.create({
    planId: planId,
    nAfiliado: nAfiliado,
  });

  const nuevoContratoId = nuevoContrato.id;

  const titular = await Afiliado.create({
    tipoDocumentoId,
    numeroDocumento,
    fechaNacimiento,
    nombre: capitalizedNombre,
    apellido: capitalizedApellido,
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
      const nuevoIntegrante = await Afiliado.create({
        tipoDocumentoId: miembro.tipoDocumentoId,
        numeroDocumento: miembro.numeroDocumento,
        fechaNacimiento: miembro.fechaNacimiento,
        nombre: miembro.nombre,
        apellido: miembro.apellido,
        vigenciaInicio: miembro.vigenciaInicio,
        vigenciaFin: miembro.vigenciaFin,
        nIntegrante: nIntegrante,
        contratoId: nuevoContratoId,
        titularId: titular.id,
        parentescoId: miembro.parentescoId,
      });

      nIntegrante++;

      await crearEmails(miembro.emails, nuevoIntegrante.id);
      await crearTelefonos(miembro.telefonos, nuevoIntegrante.id);
      await crearDirecciones(miembro.direcciones, nuevoIntegrante.id);

      if (miembro.tieneSituacionTerapeutica) {
        await crearSituacionesTerapeuticas(
          miembro.situacionesTerapeuticas,
          nuevoIntegrante.id
        );
      }
    }
  }

  res.status(201).json(titular.id);
};

const obtenerTitulares = async (req, res) => {
  const { estado } = req.query; //el query param 'estado' (ej: /api/afiliados?estado=todos trae todos los titulares, sin importar su vigencia)
  const hoy = new Date();
  let condicion = [];

  if (!estado) {
    condicion = [
      { titularId: null, vigenciaFin: { [Op.is]: null } },
      { titularId: null, vigenciaFin: { [Op.gte]: hoy } }
    ];
  } else{
    condicion = [
      { titularId: null },
    ]
  }

  const titulares = await Afiliado.findAll({
    where: { [Op.or]: condicion },

    attributes: [
      "id",
      "nombre",
      "apellido",
      "vigenciaInicio",
      "vigenciaFin",
      "numeroDocumento",
    ],
    include: [
      {
        model: Contrato,
        attributes: ["nAfiliado"],
        include: {
          model: PlanMedico,
          as: "plan",
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
        attributes: {
          exclude: ["createdAt", "updatedAt", "afiliadoId", "direccionId"],
        },
        include: {
          model: Direccion, // Y dentro de Domicilio, incluyo Direccion
          attributes: { exclude: ["createdAt", "updatedAt", "provinciaId"] },
          include: {
            model: Provincia,
            as: "Provincia",
            attributes: ["nombre"],
          },
        },
      },
    ],
    order: [["id", "ASC"]],
  });

  res.status(200).json(titulares);
};

const obtenerAfiliado = async (req, res) => {
  const { id } = req.params;

  const afiliado = await Afiliado.findByPk(id, {
    attributes: [
      "id",
      "nombre",
      "apellido",
      "fechaNacimiento",
      "vigenciaInicio",
      "vigenciaFin",
      "numeroDocumento",
      "nIntegrante",
      "titularId",
    ],


    include: [
      ...includeAfiliadoCompleto(), //los 3 puntos son para desestructurar el array y agregar sus elementos al nuevo array

      //Incluyo a los integrantes dependientes del titular
      {
        model: Afiliado,
        as: "dependientes",
        separate: true, // Sin esto no trae las fechas de inicio y fin de las situaciones terapeuticas, pero para que funcione hay que eliminar el Order que está abajo.
        attributes: [
          "id",
          "nombre",
          "apellido",
          "fechaNacimiento",
          "vigenciaInicio",
          "vigenciaFin",
          "numeroDocumento",
          "nIntegrante",
          "titularId",
        ],

        include: includeAfiliadoCompleto(),
      },
    ],
    // order: [[{ model: Afiliado, as: "dependientes" }, "nIntegrante", "ASC"]]
  });

  if (!afiliado) { // TODO: manejar error en el middleware
    return res.status(404).json({ error: "Afiliado no encontrado." });
  }

  res.status(200).json(afiliado);
};

const agregarDependiente = async (req, res) => {
  const { id } = req.params;

  const {
    tipoDocumentoId,
    numeroDocumento,
    fechaNacimiento,
    nombre,
    apellido,
    parentescoId,
    vigenciaInicio,
    vigenciaFin,
    emails = [],
    telefonos = [],
    direcciones = [],
    tieneSituacionTerapeutica,
    situacionesTerapeuticas = [],
  } = req.body;


  const titular = await Afiliado.findByPk(id);

  if (titular.titularId !== null) { //Delegar la verificación a un middleware de autorización ? TODO
    return res.status(400).json({ error: "El ID proporcionado no pertenece a un titular." });
  }

  //Calcular el próximo número de integrante
  const totalDependientes = await Afiliado.count({
    where: { titularId: titular.id },
  });
  const nIntegrante = totalDependientes + 2; //Titular es 1 y no se cuenta, por eso se suma 2

  //Creación del nuevo integrante del grupo familiar
  const nuevoIntegrante = await Afiliado.create({
    tipoDocumentoId,
    numeroDocumento,
    fechaNacimiento,
    nombre,
    apellido,
    vigenciaInicio,
    vigenciaFin,
    nIntegrante: nIntegrante,
    contratoId: titular.contratoId, //Hereda el contrato del titular
    titularId: titular.id,
    parentescoId,
  });

  await crearEmails(emails, nuevoIntegrante.id);
  await crearTelefonos(telefonos, nuevoIntegrante.id);
  await crearDirecciones(direcciones, nuevoIntegrante.id);

  if (tieneSituacionTerapeutica) {
    await crearSituacionesTerapeuticas(situacionesTerapeuticas, nuevoIntegrante.id);
  }

  res.status(201).json(nuevoIntegrante);
};

const bajaAfiliado = async (req, res) => {
  const { id } = req.params;
  const { fechaBaja } = req.body;

  const afiliado = await Afiliado.findByPk(id);

  afiliado.vigenciaFin = fechaBaja ? fechaBaja : new Date();

  const dependientes = await Afiliado.findAll({
    where: { titularId: afiliado.id },
  });
  for (const dep of dependientes) {
    dep.vigenciaFin = fechaBaja ? fechaBaja : new Date();
    await dep.save();
  }

  await afiliado.save();

  res.status(200).json(afiliado);
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
    
    const calleCapitalizada = await capitalizarCadena(direccionData.calle);
    const localidadCapitalizada = await capitalizarCadena(direccionData.localidad);

    const datosParaCrear = {
      ...direccionData,
      calle: calleCapitalizada,
      localidad: localidadCapitalizada,
    };

    const [direccion] = await Direccion.findOrCreate({
      where: {
        calle: calleCapitalizada,
        altura: direccionData.altura,
        pisoDepto: direccionData.pisoDepto,
        localidad: direccionData.localidad,
        codigoPostal: direccionData.codigoPostal,
      },
      defaults: datosParaCrear,
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
  obtenerAfiliado,
  agregarDependiente,
  bajaAfiliado,
};
