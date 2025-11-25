const { capitalizarCadena } = require("../services/capitalizarCadena");
const {
  Prestador,
  Direccion,
  Provincia,
  Email,
  Telefono,
  LugarAtencion,
  HorarioAtencion,
  Especialidad,
  AgendaTurnos
} = require("../db/models");

const { Op } = require("sequelize");

//Crear prestador
const crearPrestador = async (req, res) => {
  const {
    nombre,
    cuilCuit,
    esCentroMedico,
    integraCentroMedico,
    centroMedicoQueIntegra,
    especialidades, // Array de IDs { id: X }
    emails, // Array de objetos { direccion:... }
    telefonos, // Array de objetos { numero: ... }
    lugaresAtencion, // Array de objetos , incluyendo la Dirección
  } = req.body;

  const nuevoPrestador = await Prestador.create({
    nombre: await capitalizarCadena(nombre),
    cuilCuit,
    esCentroMedico,
    integraCentroMedico,
  });

  const nuevoPrestadorId = nuevoPrestador.id;

  if (integraCentroMedico) {
    await nuevoPrestador.update({ centroMedicoId: centroMedicoQueIntegra });
  }

  //Asignamos todos los mails
  const datosEmails = emails.map((e) => ({
    direccion: e.direccion,
    propietarioId: nuevoPrestadorId,
    propietarioTipo: "Prestador",
  }));
  await Email.bulkCreate(datosEmails); //<-- bulkCreate método de Sequelize para insertar múltiples registros en la db

  //Asignamos todos los teléfonos
  const datosTelefonos = telefonos.map((t) => ({
    numero: t.numero,
    propietarioId: nuevoPrestadorId,
    propietarioTipo: "Prestador",
  }));
  await Telefono.bulkCreate(datosTelefonos); //<-- bulkCreate método de Sequelize para insertar múltiples registros en la db

  especialidades.map(async (e) => {
    const esp = await Especialidad.findByPk(e);
    if (esp) {
      nuevoPrestador.addEspecialidad(esp);
    }
  });

  //Por cada lugar de atención creamos una dirección y un lugarAtención con esa direccionId y prestadorId
  for (const lugar of lugaresAtencion) {
    const nuevaDireccion = await Direccion.create({
      calle: await capitalizarCadena(lugar.calle),
      altura: lugar.altura,
      pisoDepto: lugar.pisoDepto ? lugar.pisoDepto : null,
      codigoPostal: lugar.codigoPostal ? lugar.codigoPostal : null,
      localidad: await capitalizarCadena(lugar.localidad),
      provinciaId: lugar.provincia

    });

    const nuevoLugarAtencion = await LugarAtencion.create({
      prestadorId: nuevoPrestadorId,
      direccionId: nuevaDireccion.id,
    });

    //Por cada lugar extraemos el array de horarios y por cada uno lo creamos con la FK lugarAtencionId
    for (const horarioData of lugar.horarios) {

      for (const dia of horarioData.dias) {
        const nuevoHorario = await HorarioAtencion.create({
          horaInicio: horarioData.horaInicio,
          horaFin: horarioData.horaFin,
          lugarAtencionId: nuevoLugarAtencion.id,
          dia: dia,
          disponible: true
        });

      }

    }
  }

  res.status(201).json(nuevoPrestador);
};

//obtener prestadores
const obtenerPrestadores = async (_, res) => {
  const prestadores = await Prestador.findAll({
    include: [
      { model: Email, attributes: ["id", "direccion"] },
      { model: Telefono, attributes: ["id", "numero"] },
      {
        model: Especialidad,
        as: "Especialidad",
        attributes: ["id", "nombre"],
        through: { attributes: [] },
      },
      {
        model: LugarAtencion,
        as: "CentroDeAtencion",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: Direccion,
            as: "Direccion",
            attributes: ["calle", "altura", "pisoDepto", "codigoPostal", "localidad"],
            include: [
              {
                model: Provincia,
                as: "Provincia",
                attributes: ["nombre"],
              },
            ],
          },
          {
            model: HorarioAtencion,
            as: "Horarios",
            where: { esParcial: false },
            required: false
          },
        ],
      },
    ],
    order: [
      ["updatedAt", "DESC"],
    ],
  });
  return res.status(200).json(prestadores);
};

const obtenerPrestadoresFormateados = async (req, res) => {

  const {
    textInputSearch,
    tipoPrestador,
    especialidad,
    localidad,
    provincia,
    creacionDesde,
    creacionHasta
  } = req.query;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const where = {};
  const rangoDeFecha = {};

  if (textInputSearch && textInputSearch.trim() !== "") {
    where[Op.or] = [
      { nombre: { [Op.iLike]: `%${textInputSearch}%` } },
      { cuilCuit: { [Op.iLike]: `%${textInputSearch}%` } },
      { "$CentroDeAtencion.Direccion.codigoPostal$": { [Op.iLike]: `%${textInputSearch}%` } }
    ]
  }

  if (tipoPrestador) {
    where.esCentroMedico = tipoPrestador;
  }

  if (especialidad) {
    where["$Especialidad.id$"] = especialidad
  }

  if (localidad) {
    where["$CentroDeAtencion.Direccion.localidad$"] = localidad
  }

  if (provincia) {
    where["$CentroDeAtencion.Direccion.Provincia.nombre$"] = provincia
  }

  if (creacionDesde) {
    const fechaDesde = new Date(creacionDesde);
    fechaDesde.setHours(0, 0, 0, 0);
    rangoDeFecha[Op.gte] = fechaDesde;
  }

  if (creacionHasta) {
    const fechaHasta = new Date(creacionHasta);
    fechaHasta.setHours(23, 59, 59, 999);
    rangoDeFecha[Op.lte] = fechaHasta;
  }

  if (creacionDesde || creacionHasta) {
    where.createdAt = rangoDeFecha
  }

  const queryOptions = {
    limit,
    offset,
    distinct: true,
    order: [["updatedAt", "DESC"]],
    include: [
      { model: Email, attributes: ["id", "direccion"] },
      { model: Telefono, attributes: ["id", "numero"] },
      {
        model: Especialidad,
        as: "Especialidad",
        attributes: ["id", "nombre"],
        through: { attributes: [] },
        required: !!especialidad,
        duplicating: false,
      },
      {
        model: LugarAtencion,
        as: "CentroDeAtencion",
        duplicating: false,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: Direccion,
            as: "Direccion",
            required: !!(localidad || provincia || textInputSearch),
            duplicating: false,
            attributes: ["calle", "altura", "pisoDepto", "codigoPostal", "localidad", "provinciaId"],
            include: [
              {
                model: Provincia,
                as: "Provincia",
                required: !!provincia,
                duplicating: false,
                attributes: ["nombre"],
              },
            ],
          },
          {
            model: HorarioAtencion,
            as: "Horarios",
            where: { esParcial: false },
            required: false
          },
        ],
      },
    ],
    where: where
  }

  const { count, rows: prestadores } = await Prestador.findAndCountAll(queryOptions);

  const prestadoresFormateados = prestadores.map((prestador) => {
    return formatearPrestador(prestador)
  })

  res.status(200).json({
    total: count,
    page: page,
    limit: limit,
    items: prestadoresFormateados
  });
};

const obtenerLocalidadesPrestadores = async (_, res) => {

  const prestadores = await Prestador.findAll({
    include: [
      {
        model: LugarAtencion,
        as: "CentroDeAtencion",
        include: [{ model: Direccion, as: "Direccion" }]
      }
    ]
  })

  const setLocalidades = new Set()

  const direcciones = prestadores.flatMap((p) => p.CentroDeAtencion.map((c) => c.Direccion))

  direcciones.forEach((d) => {
    const localidad = d.localidad
    if (localidad) {
      setLocalidades.add(localidad)
    }
  })

  const localidadesFormateadas = Array.from(setLocalidades).map((l) => ({ value: l, label: l }))

  res.status(200).json(localidadesFormateadas);
}

const obtenerProvinciasPrestadores = async (_, res) => {
  const prestadores = await Prestador.findAll({
    include: [
      {
        model: LugarAtencion,
        as: "CentroDeAtencion",
        include: [{ model: Direccion, as: "Direccion", include: [{ model: Provincia, as: "Provincia" }] }]
      }
    ]
  })

  const setProvincias = new Set()

  const direcciones = prestadores.flatMap((p) => p.CentroDeAtencion.map((c) => c.Direccion))

  direcciones.forEach((d) => {
    const provincia = d.Provincia
    if (provincia) {
      setProvincias.add(provincia.nombre)
    }
  })

  const provinciasFormateadas = Array.from(setProvincias).map((p) => ({ value: p, label: p }))



  res.status(200).json(provinciasFormateadas);
}

const formatearPrestador = (prestador) => {
  //disponibilidad
  const lugares = prestador.CentroDeAtencion.map(
    (c) => (
      {
        id: c.id,
        calle: c.Direccion.calle,
        altura: c.Direccion.altura,
        pisoDepto: c.Direccion.pisoDepto,
        codigoPostal: c.Direccion.codigoPostal,
        localidad: c.Direccion.localidad,
        provincia: c.Direccion.Provincia.nombre
      }
    )
  )

  const prestadorFormateado = {
    id: prestador.id,
    nombre: prestador.nombre,
    cuilCuit: prestador.cuilCuit,
    esCentroMedico: prestador.esCentroMedico,
    especialidades: prestador.Especialidad,
    emails: prestador.Emails,
    telefonos: prestador.Telefonos,
    centrosDeAtencion: lugares,
    createdAt: prestador.createdAt
  }

  return (prestadorFormateado)
};

// Obtener prestador por id
const obtenerPrestador = async (req, res) => {
  const { id } = req.params;

  const prestador = await Prestador.findByPk(id, {
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: [
      { model: Email },
      { model: Telefono },
      {
        model: Especialidad,
        as: "Especialidad",
        through: { attributes: [] },
      },
      {
        model: LugarAtencion,
        as: "CentroDeAtencion",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: Direccion,
            as: "Direccion",
            include: [
              {
                model: Provincia,
                as: "Provincia",
              },
            ],
          },
          {
            model: HorarioAtencion,
            as: "Horarios",
            where: { esParcial: false },
            required: false
          },
        ],
      },
    ],
  });

  let centro;

  if (prestador.integraCentroMedico) {
    centro = await Prestador.findByPk(prestador.centroMedicoId, {
      attributes: ['id', 'nombre']
    });
  }

  const respuesta = prestador.integraCentroMedico ? { ...prestador.toJSON(), CentroMedico: centro } : prestador;

  return res.status(200).json(respuesta);
};

//Actualizar datos personales de un prestador
const actualizarDatosPersonalesPrestador = async (req, res) => {
  const { id } = req.params;
  const { nombre, cuilCuit, emails, telefonos } = req.body;

  const prestador = await Prestador.findByPk(id);

  await prestador.update({ nombre: await capitalizarCadena(nombre), cuilCuit });

  //Emails (Para que esto funcione al editar tendrían que volverse a enviar los mismos que tiene si no se modifican)
  await Email.destroy({ where: { propietarioId: id, propietarioTipo: 'Prestador' } });

  const datosEmails = emails.map((e) => ({
    direccion: e.direccion,
    propietarioId: id,
    propietarioTipo: "Prestador",
  }));
  await Email.bulkCreate(datosEmails); // Si falla, los emails viejos ya fueron borrados

  //Teléfonos (borramos los viejos e insertamos los nuevos)
  await Telefono.destroy({ where: { propietarioId: id, propietarioTipo: 'Prestador' } });

  const datosTelefonos = telefonos.map((tel) => ({
    numero: tel.numero,
    propietarioId: id,
    propietarioTipo: "Prestador",
  }));
  await Telefono.bulkCreate(datosTelefonos); // Si falla, los teléfonos viejos ya fueron borrados

  return res
    .status(200)
    .json({ message: "Prestador actualizado correctamente." }, prestador);
};

//Actualizar lugares de atencion y horarios
const actualizarLugaresAtencionPrestador = async (req, res) => {
  const { id } = req.params;
  const { lugaresAtencion } = req.body;

  const prestador = await Prestador.findByPk(id);

  //Eliminacion:
  const lugaresActuales = await LugarAtencion.findAll({
    where: { prestadorId: id },
    include: [{ model: HorarioAtencion, as: "Horarios" }],
  });

  for (const lugar of lugaresActuales) {
    await HorarioAtencion.destroy({ where: { lugarAtencionId: lugar.id } });

    await lugar.destroy();
    //destruyo las direcciones? porque otros lugares de atención podrían usarla también
    await Direccion.destroy({ where: { id: lugar.direccionId } });
  }

  //deberia borrar las agendas del prestador ya que cambio los horarios y lugares de atencion
  await AgendaTurnos.destroy({ where: { prestadorId: id } });

  //Creacion:
  for (const lugar of lugaresAtencion) {
    //Si no elimino las direcciones, cómo sé que no estoy creando duplicados?
    const nuevaDireccion = await Direccion.create({
      calle: await capitalizarCadena(lugar.calle),
      altura: lugar.altura,
      pisoDepto: lugar.pisoDepto,
      codigoPostal: lugar.codigoPostal,
      localidad: await capitalizarCadena(lugar.localidad),
      provinciaId: lugar.provincia,
    });

    const nuevoLugarAtencion = await LugarAtencion.create({
      prestadorId: id,
      direccionId: nuevaDireccion.id,
    });

    for (const horarioData of lugar.horarios) {

      for (const dia of horarioData.dias) {
        const nuevoHorario = await HorarioAtencion.create({
          horaInicio: horarioData.horaInicio,
          horaFin: horarioData.horaFin,
          lugarAtencionId: nuevoLugarAtencion.id,
          dia: dia,
          disponible: true
        });
      }

    }
  }

  return res.status(200).json({
    message: "Lugares de atencion del Prestador actualizados correctamente.",
    prestador,
  });
};

//actualizar especialidades
const actualizarEspecialidadesPrestador = async (req, res) => {
  const { id } = req.params;
  const { especialidades } = req.body;

  const prestador = await Prestador.findByPk(id, {
    include: [{
      model: Especialidad,
      as: "Especialidad"
    }]
  });

  const especialidadesViejas = prestador.Especialidad.map(e => e.id);

  // Especialidades a eliminar = estaban antes y ya no vienen
  const idsAEliminar = especialidadesViejas.filter(idViejo => !especialidades.includes(idViejo));

  // Especialidades a agregar = vienen nuevas y no estaban antes
  const idsAAgregar = especialidades.filter(idNuevo => !especialidadesViejas.includes(idNuevo));

  // 1) Eliminar relaciones viejas y sus agendas asociadas
  if (idsAEliminar.length > 0) {
    for (const espId of idsAEliminar) {
      // eliminar relación M-M
      await prestador.removeEspecialidad(espId);

      // eliminar agendas asociadas SOLO a esa especialidad
      await AgendaTurnos.destroy({
        where: {
          prestadorId: id,
          especialidadId: espId
        }
      });
    }
  }

  // 2) Agregar nuevas especialidades
  if (idsAAgregar.length > 0) {
    for (const espId of idsAAgregar) {
      const esp = await Especialidad.findByPk(espId);
      if (esp) {
        await prestador.addEspecialidad(esp);
      }
    }
  }

  return res
    .status(200)
    .json({ message: "Especialidades actualizadas correctamente." });
};

//actualizar si es centro médico
const actualizarCentroMedicoPrestador = async (req, res) => {
  const { id } = req.params;
  const { esCentroMedico, integraCentroMedico, centroMedicoQueIntegra } =
    req.body;

  const prestador = await Prestador.findByPk(id);
  await prestador.update({
    esCentroMedico,
    integraCentroMedico: esCentroMedico ? false : integraCentroMedico,
    centroMedicoId: integraCentroMedico ? centroMedicoQueIntegra : null,
  });
  return res
    .status(200)
    .json({ message: "Prestador actualizado correctamente." }, prestador);
};

//falta eliminar entidades relacionadas
const eliminarPrestador = async (req, res) => {
  const { id } = req.params;

  const prestador = await Prestador.findByPk(id);

  await Email.destroy({
    where: {
      propietarioId: id,
      propietarioTipo: "Prestador",
    },
  });
  await Telefono.destroy({
    where: {
      propietarioId: id,
      propietarioTipo: "Prestador",
    },
  });
  await prestador.setEspecialidad([]);

  const lugaresActuales = await LugarAtencion.findAll({
    where: { prestadorId: id },
    include: [{ model: HorarioAtencion, as: "Horarios" }],
  });

  for (const lugar of lugaresActuales) {
    await HorarioAtencion.destroy({ where: { lugarAtencionId: lugar.id } });
    await lugar.destroy();
    //destruyo las direcciones? porque otros lugares de atención podrían usarla también
    await Direccion.destroy({ where: { id: lugar.direccionId } });
  }

  //deberia borrar las agendas del prestador ya que este no existira mas
  await AgendaTurnos.destroy({ where: { prestadorId: id } });

  await prestador.destroy();

  return res
    .status(200)
    .json({ message: "Prestador eliminado correctamente." });
};

const obtenerCentrosMedicos = async (req, res) => {
  const prestadores = await Prestador.findAll();

  const centrosMedicos = prestadores.filter(p => p.esCentroMedico);

  const centros = centrosMedicos.map(c => ({
    id: c.id,
    nombre: c.nombre
  }));
  return res.status(200).json(centros);
}

module.exports = {
  crearPrestador,
  obtenerPrestadores,
  obtenerPrestadoresFormateados,
  obtenerPrestador,
  actualizarDatosPersonalesPrestador,
  actualizarLugaresAtencionPrestador,
  actualizarEspecialidadesPrestador,
  actualizarCentroMedicoPrestador,
  eliminarPrestador,
  obtenerLocalidadesPrestadores,
  obtenerCentrosMedicos,
  obtenerProvinciasPrestadores
};
