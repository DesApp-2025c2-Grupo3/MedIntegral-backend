const { Op } = require("sequelize");
const { generarProximoNAfiliado } = require("../services/contratoService");
const { capitalizarCadena } = require("../services/capitalizarCadena");
const { generarReporteAfiliadoPDF } = require('../utils/pdfGenerator.js');

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
    attributes: {
      exclude: ["createdAt", "updatedAt", "afiliadoId", "direccionId"],
    },
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
      const capitalizedNombre = await capitalizarCadena(miembro.nombre);
      const capitalizedApellido = await capitalizarCadena(miembro.apellido);

      const nuevoIntegrante = await Afiliado.create({
        tipoDocumentoId: miembro.tipoDocumentoId,
        numeroDocumento: miembro.numeroDocumento,
        fechaNacimiento: miembro.fechaNacimiento,
        nombre: capitalizedNombre,
        apellido: capitalizedApellido,
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
  const {
    textInputSearch,
    tipoDocumento,
    nroAfiliado,
    fechaNacimiento,
    planMedico,
    provincia,
    localidad,
    telefono,
    email,
    vigenciaDesde,
    vigenciaHasta,
    creacionDesde,
    creacionHasta,
    estado,
  } = req.query;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const where = {};
  where[Op.and] = [];
  const rangoDeFecha = {};
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const rangoVigenciaInicio = new Date(hoy);
  rangoVigenciaInicio.setDate(rangoVigenciaInicio.getDate() + 1);

  if (textInputSearch && textInputSearch.trim() !== "") {
    where[Op.or] = [
      { nombre: { [Op.iLike]: `%${textInputSearch}%` } },
      { apellido: { [Op.iLike]: `%${textInputSearch}%` } },
      { numeroDocumento: { [Op.iLike]: `%${textInputSearch}%` } },
    ];
  }

  switch (estado) {
    case "Bajas":
      where[Op.and].push({ titularId: null, vigenciaFin: { [Op.lte]: hoy } });
      break;

    case "Vigencia futura":
      where[Op.and].push({
        vigenciaInicio: { [Op.gte]: rangoVigenciaInicio },
      });
      break;

    case "Todos":
      where[Op.and].push({ titularId: null });
      break;

    default:
      {
        where[Op.and].push({
          [Op.or]: [
            { titularId: null, vigenciaFin: { [Op.is]: null } },
            { titularId: null, vigenciaFin: { [Op.gte]: hoy } },
          ],
        });

        where[Op.and].push({
          vigenciaInicio: { [Op.lte]: rangoVigenciaInicio },
        });
      }
      break;
  }

  if (tipoDocumento) {
    where["$tipoDocumento.tipo$"] = tipoDocumento;
  }

  if (planMedico) {
    where["$Contrato.plan.plan$"] = planMedico;
  }

  if (nroAfiliado) {
    where["$Contrato.nAfiliado$"] = nroAfiliado;
  }

  if (fechaNacimiento) {
    const fecha = new Date(fechaNacimiento);
    where.fechaNacimiento = fecha;
  }

  if (vigenciaDesde) {
    const fechaVigenciaDesde = new Date(vigenciaDesde);
    where.vigenciaInicio = { [Op.gte]: fechaVigenciaDesde };
  }

  if (vigenciaHasta) {
    const fechaVigenciaHasta = new Date(vigenciaHasta);
    fechaVigenciaHasta.setDate(fechaVigenciaHasta.getDate() + 1);
    where.vigenciaFin = { [Op.lte]: fechaVigenciaHasta };
  }

  if (creacionDesde) {
    const fechaDesde = new Date(creacionDesde);
    fechaDesde.setHours(0, 0, 0, 0);
    rangoDeFecha[Op.gte] = fechaDesde;
  }

  if (creacionHasta) {
    const fechaHasta = new Date(creacionHasta);
    fechaHasta.setDate(fechaHasta.getDate() + 1);
    rangoDeFecha[Op.lte] = fechaHasta;
  }

  if (creacionDesde || creacionHasta) {
    where.createdAt = rangoDeFecha;
  }

  const queryOptions = {
    limit,
    offset,
    distinct: true,
    subQuery: false,
    attributes: [
      "id",
      "nombre",
      "apellido",
      "vigenciaInicio",
      "vigenciaFin",
      "numeroDocumento",
      "fechaNacimiento",
    ],
    include: [
      {
        model: Contrato,
        attributes: ["nAfiliado"],
        required: !!(planMedico || nroAfiliado),
        include: {
          model: PlanMedico,
          as: "plan",
          attributes: ["plan"],
          required: !!(planMedico || nroAfiliado),
        },
      },
      {
        model: TipoDocumento,
        as: "tipoDocumento",
        attributes: ["tipo"],
        required: !!tipoDocumento,
      },
      {
        model: Email,
        as: "emails",
        attributes: ["direccion"],
        required: !!email,
        separate: !email,
        where: { ...(email && { direccion: email }) },
      },
      {
        model: Telefono,
        as: "telefonos",
        attributes: ["numero"],
        required: !!telefono,
        separate: !telefono,
        where: { ...(telefono && { numero: telefono }) },
      },
      {
        model: Domicilio,
        as: "domicilios",
        attributes: {
          exclude: ["createdAt", "updatedAt", "afiliadoId", "direccionId"],
        },
        required: !!(localidad || provincia),
        separate: !(localidad || provincia),
        include: [
          {
            model: Direccion,
            attributes: { exclude: ["createdAt", "updatedAt"] },
            required: !!(localidad || provincia),
            where: {
              ...(localidad && { localidad: localidad }),
              ...(provincia && { provinciaId: provincia }),
            },
            include: [
              {
                model: Provincia,
                as: "Provincia",
                attributes: ["nombre"],
              },
            ],
          },
        ],
      },
    ],
    order: [["updatedAt", "DESC"]],
    where: where,
  };

  const { count, rows: titulares } = await Afiliado.findAndCountAll(
    queryOptions
  );

  res.status(200).json({
    total: count,
    page: page,
    limit: limit,
    items: titulares,
  });
};

const obtenerLocalidadesAfiliados = async (_, res) => {
  const afiliados = await Afiliado.findAll({
    include: [
      { model: Domicilio, as: "domicilios", include: [{ model: Direccion }] },
    ],
  });
  const setLocalidades = new Set();

  const direcciones = afiliados.flatMap((a) =>
    a.domicilios.map((d) => d.Direccion)
  );
  const localidades = direcciones.map((d) => d.localidad);

  localidades.forEach((localidad) => {
    if (localidad) {
      setLocalidades.add(localidad);
    }
  });

  const localidadesFormateadas = Array.from(setLocalidades).map(
    (localidad) => ({ value: localidad, label: localidad })
  );

  return res.status(200).json(localidadesFormateadas);
};

const obtenerProvinciasAfiliados = async (_, res) => {
  const afiliados = await Afiliado.findAll({
    include: [
      {
        model: Domicilio,
        as: "domicilios",
        include: [
          {
            model: Direccion,
            include: [{ model: Provincia, as: "Provincia" }],
          },
        ],
      },
    ],
  });
  const setProvincias = new Set();

  const direcciones = afiliados.flatMap((a) =>
    a.domicilios.map((d) => d.Direccion)
  );
  const provincias = direcciones.map((d) => d.Provincia.nombre);

  provincias.forEach((provincia) => {
    if (provincia) {
      setProvincias.add(provincia);
    }
  });

  const provinciasTotales = await Provincia.findAll();
  const filtradas = Array.from(setProvincias).flatMap((provincia) =>
    provinciasTotales.filter((p) => p.nombre == provincia)
  );

  return res.status(200).json(filtradas);
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
        order: [["nIntegrante", "ASC"]],
      },
    ],
    // order: [[{ model: Afiliado, as: "dependientes" }, "nIntegrante", "ASC"]]
  });

  if (!afiliado) {
    // TODO: manejar error en el middleware
    return res.status(404).json({ error: "Afiliado no encontrado." });
  }

  res.status(200).json(afiliado);
};

const obtenerReporteAfiliado = async (req, res) => {
  const { id } = req.params;

  const afiliado = await Afiliado.findByPk(id, {
    attributes: [
      "nombre", 
      "apellido",
      "numeroDocumento",
    ],
    include: [
      {
        model: SituacionTerapeutica,
        as: "situacionesTerapeuticas",
        attributes: ["nombre"],
        through: {
          model: AfiliadoSituaciones,
          attributes: ["fechaInicio", "fechaFin"],
        },
      },

      {
        model: Afiliado,
        as: "dependientes",
        separate: true,
        attributes: [
          "id",
          "nombre",
          "apellido",
          "numeroDocumento",
        ],

        include: [
          {
            model: SituacionTerapeutica,
            as: "situacionesTerapeuticas",
            attributes: ["nombre"],
            through: {
              model: AfiliadoSituaciones,
              attributes: ["fechaInicio", "fechaFin"],
            },
          },
        ],
      },
    ],
  })

  if (!afiliado) {
    return res.status(404).json({ error: "Afiliado no encontrado." })
  };


  const situacionesFormateadas = (st) => ({
    situaciones: st.map((s) => s.nombre).join("\n\n"),
    inicio: st.map((s)=>formatoFecha(s.AfiliadoSituaciones.fechaInicio)).join("\n\n"),
    fin: st.map((s)=>formatoFecha(s.AfiliadoSituaciones.fechaFin)).join("\n\n"),
  });
  
  const dependientes = afiliado.dependientes.map((d) => ({
    nombre: `${d.nombre} ${d.apellido}`,
    numeroDocumento: d.numeroDocumento,
    ...situacionesFormateadas(d.situacionesTerapeuticas?? [])    
  }))

  const titularYGrupoFamiliar = [
    {
      nombre: `${afiliado.nombre} ${afiliado.apellido}`,
      numeroDocumento: afiliado.numeroDocumento,
      ...situacionesFormateadas(afiliado.situacionesTerapeuticas?? [])
    },
    ...dependientes
  ]

  const dataTable = {
    tittle: 'Reporte Situaciones Terapéuticas',
    headers: [
      { label:"Afiliado/s", property: 'nombre', align: 'center' },
      { label:"DNI", property: 'numeroDocumento', align: 'center' }, 
      { label:"S.Terapéuticas", property: 'situaciones', align: 'center' }, 
      { label:"Desde", property: 'inicio', align: 'center' }, 
      { label:"Hasta", property: 'fin', align: 'center' },
    ],
    datas: titularYGrupoFamiliar  
  }

  const stream = res.writeHead(200,{
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=reporteAfiliado${id}.pdf`,
  })

  generarReporteAfiliadoPDF(
    dataTable,
    (data) => stream.write(data),
    () => stream.end()
  );
};

const formatoFecha = (fechaUtc) => {

  if(fechaUtc === "" || fechaUtc === null){
    return;
  }
  const fecha = new Date(fechaUtc);
  const dia = fecha.getUTCDate();
  const mes = fecha.getUTCMonth()+1;
  const anio = fecha.getUTCFullYear();

  return `${dia}-${mes}-${anio}`;
}

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

  if (titular.titularId !== null) {
    //Delegar la verificación a un middleware de autorización ? TODO
    return res
      .status(400)
      .json({ error: "El ID proporcionado no pertenece a un titular." });
  }

  //Calcular el próximo número de integrante
  const totalDependientes = await Afiliado.count({
    where: { titularId: titular.id },
  });
  const nIntegrante = totalDependientes + 2; //Titular es 1 y no se cuenta, por eso se suma 2

  const capitalizedNombre = await capitalizarCadena(nombre);
  const capitalizedApellido = await capitalizarCadena(apellido);

  //Creación del nuevo integrante del grupo familiar
  const nuevoIntegrante = await Afiliado.create({
    tipoDocumentoId,
    numeroDocumento,
    fechaNacimiento,
    nombre: capitalizedNombre,
    apellido: capitalizedApellido,
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
    await crearSituacionesTerapeuticas(
      situacionesTerapeuticas,
      nuevoIntegrante.id
    );
  }

  res.status(201).json(nuevoIntegrante);
};

const bajaAfiliado = async (req, res) => {
  const { id } = req.params;
  const { fechaBaja } = req.body;

  const afiliado = await Afiliado.findByPk(id);

  const fechaBajaDate = fechaBaja ? new Date(fechaBaja) : new Date();
  afiliado.vigenciaFin = fechaBajaDate;
  await afiliado.save();

  if (afiliado.titularId === null) {
    const dependientes = await Afiliado.findAll({
      where: { titularId: afiliado.id },
    });

    for (const dep of dependientes) {
      const fechaFinDependiente = dep.vigenciaFin
        ? new Date(dep.vigenciaFin)
        : null;

      if (!fechaFinDependiente || fechaFinDependiente > fechaBajaDate) {
        dep.vigenciaFin = fechaBajaDate;
        await dep.save();
      }
    }
  }

  res.status(200).json(afiliado);
};

const modificarFechaBaja = async (req, res) => {
  const { id } = req.params;
  const { fechaBaja } = req.body;

  const afiliado = await Afiliado.findByPk(id);
  const fechaBajaDate = new Date(fechaBaja);

  afiliado.vigenciaFin = fechaBajaDate;
  await afiliado.save();

  if (afiliado.titularId === null) {
    const dependientes = await Afiliado.findAll({
      where: { titularId: afiliado.id },
    });

    for (const dep of dependientes) {
      dep.vigenciaFin = fechaBajaDate;
      await dep.save();
    }
  }

  res.status(200).json(afiliado);
};

const reincorporarAfiliado = async (req, res) => {
  const { id } = req.params;
  const { reincorporarGrupoFamiliar = false } = req.body;

  const afiliado = await Afiliado.findByPk(id);

  afiliado.vigenciaFin = null;
  await afiliado.save();

  if (reincorporarGrupoFamiliar && afiliado.titularId === null) {
    const dependientes = await Afiliado.findAll({
      where: { titularId: afiliado.id },
    });

    for (const dep of dependientes) {
      dep.vigenciaFin = null;
      await dep.save();
    }
  }

  res.status(200).json(afiliado);
};

const actualizarDatosPersonalesAfiliado = async (req, res) => {
  const { id } = req.params;

  const {
    tipoDocumentoId,
    numeroDocumento,
    nombre,
    apellido,
    fechaNacimiento,
    vigenciaInicio,
  } = req.body;

  const afiliado = await Afiliado.findByPk(id);

  const datosAActualizar = {};

  datosAActualizar.tipoDocumentoId = tipoDocumentoId;
  datosAActualizar.numeroDocumento = numeroDocumento;
  datosAActualizar.fechaNacimiento = fechaNacimiento;
  datosAActualizar.nombre = await capitalizarCadena(nombre);
  datosAActualizar.apellido = await capitalizarCadena(apellido);
  datosAActualizar.vigenciaInicio = vigenciaInicio;

  await afiliado.update(datosAActualizar);

  res.status(200).json(afiliado);
};

const actualizarCoberturaAfiliado = async (req, res) => {
  const { id } = req.params;
  const { planId } = req.body;

  const afiliado = await Afiliado.findByPk(id);
  const contrato = await Contrato.findByPk(afiliado.contratoId);
  await contrato.update({ planId });

  res.status(200).json(afiliado);
};

const actualizarDatosContactoAfiliado = async (req, res) => {
  const { id } = req.params;
  const { emails, telefonos } = req.body;

  const afiliado = await Afiliado.findByPk(id);
  await Email.destroy({
    where: { propietarioId: afiliado.id, propietarioTipo: "Afiliado" },
  });
  await Telefono.destroy({
    where: { propietarioId: afiliado.id, propietarioTipo: "Afiliado" },
  });
  await crearEmails(emails, afiliado.id);
  await crearTelefonos(telefonos, afiliado.id);
  res.status(200).json(afiliado);
};

const actualizarDireccionesAfiliado = async (req, res) => {
  const { id } = req.params;
  const { direcciones } = req.body;

  const afiliado = await Afiliado.findByPk(id);
  await Domicilio.destroy({ where: { afiliadoId: afiliado.id } });
  await crearDirecciones(direcciones, afiliado.id);
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
    const localidadCapitalizada = await capitalizarCadena(
      direccionData.localidad
    );

    const datosParaCrear = {
      ...direccionData,
      calle: calleCapitalizada,
      localidad: localidadCapitalizada,
      provinciaId: direccionData.provinciaId,
    };

    const [direccion] = await Direccion.findOrCreate({
      where: {
        calle: calleCapitalizada,
        altura: direccionData.altura,
        pisoDepto: direccionData.pisoDepto,
        localidad: localidadCapitalizada,
        codigoPostal: direccionData.codigoPostal,
        provinciaId: direccionData.provinciaId,
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
  obtenerReporteAfiliado,
  obtenerLocalidadesAfiliados,
  obtenerProvinciasAfiliados,
  agregarDependiente,
  bajaAfiliado,
  modificarFechaBaja,
  reincorporarAfiliado,
  actualizarDatosPersonalesAfiliado,
  actualizarCoberturaAfiliado,
  actualizarDatosContactoAfiliado,
  actualizarDireccionesAfiliado,
};
