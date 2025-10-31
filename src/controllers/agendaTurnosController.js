const { required } = require("joi");
const {
  HorarioAtencion,
  AgendaTurnos,
  Dia,
  Prestador,
  Especialidad,
  LugarAtencion,
  Direccion,
  Provincia,
} = require("../db/models");

const { Op, where } = require("sequelize");

const crearAgendaTurnos = async (req, res) => {
  const { prestadorId, especialidadId, lugaratencionId, horarios } = req.body;

  const nuevaAgendaTurnos = await AgendaTurnos.create();

  const nuevaAgendaTurnosId = nuevaAgendaTurnos.id;

  relacionarAgendaConDemasEntidades(
    nuevaAgendaTurnosId,
    prestadorId,
    especialidadId,
    lugaratencionId
  );

  for (const horario of horarios) {
    const nuevoHorario = await HorarioAtencion.create({
      agendaTurnosId: nuevaAgendaTurnosId,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
      duracionTurno: horario.duracion,
    });

    for (const diaId of horario.dias) {
      const diaExistente = await Dia.findByPk(diaId);
      if (diaExistente) {
        await nuevoHorario.addDia(diaExistente); // Usamos addDia para agregar un solo día
      }
    }
  }

  res.status(201).json(nuevaAgendaTurnos);
};

const relacionarAgendaConDemasEntidades = async (
  agendaId,
  prestadorId,
  especialidadId,
  lugarAtencionId
) => {
  await AgendaTurnos.update(
    {
      prestadorId,
      especialidadId,
      lugarAtencionId,
    },
    {
      where: { id: agendaId },
    }
  );
};

const obtenerAgendasTurnos = async (req, res) => {
  const agendas = await AgendaTurnos.findAll({
    include: [
      { model: Prestador, attributes: ["nombre"] },
      { model: Especialidad, attributes: ["nombre"] },
      {
        model: LugarAtencion,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: Direccion,
            attributes: ["calle", "altura", "pisoDepto", "localidad"],
            include: { model: Provincia, attributes: ["nombre"] },
          },
        ],
      },
      {
        model: HorarioAtencion,
        attributes: ["horaInicio", "horaFin", "duracionTurno"],
        include: {
          model: Dia,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      },
    ],
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  res.status(200).json(agendas);
};

const obtenerAgendasTurnosFormateados = async (req, res) => {
  const {
    textInputSearch,
    provincia,
    localidad,
    dia,
    duracion,
    horaInicio,
    horaFin,
    creacionDesde,
    creacionHasta,
  } = req.query;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const where = {};
  const rangoDeFecha = {}
  const fechaDesde = new Date(creacionDesde)
  const fechaHasta = new Date(creacionHasta)

  if (creacionDesde) {
    rangoDeFecha[Op.gte] = fechaDesde
  } 
  if (creacionHasta) {
    rangoDeFecha[Op.lte] = fechaHasta
  }
  if (creacionDesde || creacionHasta){
    where.createdAt = rangoDeFecha
  }

  if(textInputSearch && textInputSearch.trim() !== "") {
    where[Op.or] = [
        { "$Prestador.nombre$": { [Op.iLike]: `%${textInputSearch}%` } },
        { "$Especialidad.nombre$": { [Op.iLike]: `%${textInputSearch}%` } },
    ];
  };

  const queryOptions = {
    page: page,
    limit: limit,
    offset: offset,
    distinct: true,
    include: [
      {
        model: Prestador,
        as: "Prestador",
        attributes: ["nombre"],
        required: true,
      },
      {
        model: Especialidad,
        as: "Especialidad",
        attributes: ["nombre"],
        required: true,
      },
      {
        model: LugarAtencion,
        required: true,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: Direccion,
            attributes: ["calle", "altura", "pisoDepto", "localidad"],
            ...(localidad && { where: { localidad: localidad } }),
            include: [
              {
                model: Provincia,
                attributes: ["nombre"],
                ...(provincia && { where: { nombre: provincia } }),
              },
            ],
          },
        ],
      },
      {
        model: HorarioAtencion,
        attributes: ["horaInicio", "horaFin", "duracionTurno"],
        where: {
          ...(horaInicio && { horaInicio: { [Op.gte]: horaInicio } }),
          ...(horaFin && { horaFin: { [Op.lte]: horaFin } }),
          ...(duracion && { duracionTurno: duracion }),
        },
        include: [
          {
            model: Dia,
            attributes: { exclude: ["createdAt", "updatedAt"] },
            ...(dia && { where: { nombre: dia } }),
          },
        ],
      },
    ],
    where
  };

  const { count, rows: agendas } = await AgendaTurnos.findAndCountAll(
    queryOptions
  );

  const agendasFormateadas = agendas.map((agenda) => {
    const horarios = agenda.HorarioAtencions.map((horario) => ({
      dias: horario.Dia.map((dia) => dia.nombre),
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
      duracion: horario.duracionTurno,
    }));

    const direccionData = agenda.LugarAtencion.Direccion;

    const provincia = direccionData.Provincium;

    const direccion = {
      calle: direccionData.calle,
      altura: direccionData.altura,
      pisoDepto: direccionData.pisoDepto,
      localidad: direccionData.localidad,
      provincia: provincia.nombre,
    };

    const agendaNueva = {
      id: agenda.id,
      prestador: agenda.Prestador.nombre,
      especialidad: agenda.Especialidad.nombre,
      horariosAtencion: horarios,
      direccion: direccion,
      fechaAlta: agenda.createdAt,
    };
    return { ...agendaNueva };
  });

  res.status(200).json({
    total: count,
    page: page,
    limit: limit,
    items: agendasFormateadas,
  });
};

const obtenerUnaAgendaTurnos = async (req, res) => {
  const { id } = req.params;
  const agenda = await AgendaTurnos.findByPk(id, {
    include: [
      { model: Prestador },
      { model: Especialidad },
      {
        model: LugarAtencion,
        include: [{ model: Direccion, include: [Provincia] }],
      },
      { model: HorarioAtencion, include: { model: Dia } },
    ],
  });
  res.status(200).json(agenda);
};

const actualizarAgendaTurnos = async (req, res) => {
  const { id } = req.params;
  const { horarios, especialidadId } = req.body;

  const agendaTurnos = await AgendaTurnos.findByPk(id, {
    include: [HorarioAtencion],
  });

  if (especialidadId) {
    await AgendaTurnos.update({ especialidadId }, { where: { id } });
  }

  for (const horario of agendaTurnos.HorarioAtencions) {
    await horario.setDia([]);
  }
  await HorarioAtencion.destroy({ where: { agendaTurnosId: id } });

  for (const horario of horarios) {
    const nuevoHorario = await HorarioAtencion.create({
      agendaTurnosId: id,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
      duracionTurno: horario.duracion,
    });

    for (const diaId of horario.dias) {
      const diaExistente = await Dia.findByPk(diaId);
      if (diaExistente) {
        await nuevoHorario.addDia(diaExistente);
      }
    }
  }
  res.status(200).json(agendaTurnos);
};

const eliminarAgendaTurnos = async (req, res) => {
  const { id } = req.params;

  const agendaTurnos = await AgendaTurnos.findByPk(id, {
    include: [HorarioAtencion],
  });

  for (const horario of agendaTurnos.HorarioAtencions) {
    await horario.setDia([]);
  }

  await HorarioAtencion.destroy({ where: { agendaTurnosId: id } });

  await AgendaTurnos.destroy({ where: { id } });

  res.status(200).json({ message: "Agenda de turnos eliminada correctamente" });
};

const obtenerLocalidadesAgendas = async (_, res) => {
  const agendas = await AgendaTurnos.findAll({
    include: [
      {
        model: LugarAtencion,
        include: [{ model: Direccion }],
      },
    ],
  });

  const setLocalidades = new Set();

  agendas.forEach((agenda) => {
    const localidad = agenda.LugarAtencion?.Direccion?.localidad;
    if (localidad) {
      setLocalidades.add(localidad);
    }
  });

  const localidadesFormateadas = Array.from(setLocalidades).map(
    (localidad) => ({
      value: localidad,
      label: localidad,
    })
  );

  res.status(200).json(localidadesFormateadas);
};

const obtenerProvinciasAgendas = async (_, res) => {
  const agendas = await AgendaTurnos.findAll({
    include: [
      {
        model: LugarAtencion,
        include: [{ model: Direccion, include: [{ model: Provincia }] }],
      },
    ],
  });

  const setProvincias = new Set();

  agendas.forEach((agenda) => {
    const provincia = agenda.LugarAtencion?.Direccion?.Provincium.nombre;
    if (provincia) {
      setProvincias.add(provincia);
    }
  });

  const provinciasFormateadas = Array.from(setProvincias).map((provincia) => ({
    value: provincia,
    label: provincia,
  }));

  res.status(200).json(provinciasFormateadas);
};

module.exports = {
  crearAgendaTurnos,
  obtenerAgendasTurnos,
  obtenerAgendasTurnosFormateados,
  obtenerUnaAgendaTurnos,
  actualizarAgendaTurnos,
  eliminarAgendaTurnos,
  obtenerLocalidadesAgendas,
  obtenerProvinciasAgendas,
};
