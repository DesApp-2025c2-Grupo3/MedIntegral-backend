const {
    HorarioAtencion,
    AgendaTurnos,
    Prestador,
    Especialidad,
    LugarAtencion,
    Direccion,
    Provincia
} = require("../db/models");

const { Op } = require("sequelize");

const crearAgendaTurnos = async (req, res) => {
    const { prestadorId, especialidadId, lugaratencionId, horarios } = req.body;

    const nuevaAgendaTurnos = await AgendaTurnos.create({
        prestadorId,
        especialidadId,
        lugarAtencionId: lugaratencionId
    });

    const nuevaAgendaTurnosId = nuevaAgendaTurnos.id;

    for (const horario of horarios) {

        for (const dia of horario.dias) {

            const nuevoHorario = await HorarioAtencion.create({
                agendaTurnosId: nuevaAgendaTurnosId,
                lugarAtencionId: null,
                horaInicio: horario.horaInicio,
                horaFin: horario.horaFin,
                duracionTurno: horario.duracion,
                dia: dia
            });

        }

    }

    res.status(201).json(nuevaAgendaTurnos);
};

const obtenerAgendasTurnos = async (req, res) => {
    const agendas = await AgendaTurnos.findAll({
        include: [
            { model: Prestador, as: "Prestador", attributes: ["nombre"] },
            { model: Especialidad, as: "Especialidad", attributes: ["nombre"] },
            {
                model: LugarAtencion,
                as: "CentroDeAtencion",
                attributes: { exclude: ["createdAt", "updatedAt"] },
                include: [{ model: Direccion, as: "Direccion", attributes: ["calle", "altura", "pisoDepto", "localidad"], include: [{ model: Provincia, as: "Provincia", attributes: ["nombre"] }] }]
            },
            { model: HorarioAtencion, as: "Horarios" }
        ], attributes: { exclude: ["createdAt", "updatedAt"] }

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
    const rangoDeFecha = {};

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
        where.createdAt = rangoDeFecha;
    }

    if (textInputSearch && textInputSearch.trim() !== "") {
        where[Op.or] = [
            { "$Prestador.nombre$": { [Op.iLike]: `%${textInputSearch}%` } },
            { "$Especialidad.nombre$": { [Op.iLike]: `%${textInputSearch}%` } },
        ];
    }

    if (localidad) {
        where["$CentroDeAtencion.Direccion.localidad$"] = localidad;
    }
    if (provincia) {
        where["$CentroDeAtencion.Direccion.Provincia.nombre$"] = provincia;
    }

    const queryOptions = {
        page: page,
        limit: limit,
        offset: offset,
        distinct: true,
        where: where,
        include: [
            {
                model: Prestador,
                as: "Prestador",
                attributes: ["nombre"],
                required: true,
                include: [
                    {
                        model: Especialidad,
                        as: "Especialidad",
                        required: true,
                        attributes: ["id", "nombre"],
                    },
                    {
                        model: LugarAtencion,
                        as: "CentroDeAtencion",
                        required: true,
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                        include: [
                            {
                                model: HorarioAtencion,
                                as: "Horarios",
                                required: true,
                            },
                        ],
                    },
                ],
            },
            {
                model: Especialidad,
                as: "Especialidad",
                attributes: ["nombre"],
                required: true,
            },
            {
                model: LugarAtencion,
                as: "CentroDeAtencion",
                required: true,
                attributes: { exclude: ["createdAt", "updatedAt"] },
                include: [
                    {
                        model: Direccion,
                        as: "Direccion",
                        required: true,
                        attributes: ["calle", "altura", "pisoDepto", "localidad"],
                        include: [
                            {
                                model: Provincia,
                                as: "Provincia",
                                required: true,
                                attributes: ["nombre"],
                            },
                        ],
                    },
                    {
                        model: HorarioAtencion,
                        as: "Horarios",
                        required: true,
                        attributes: ["horaInicio", "horaFin", "dia"],

                    },
                ],
            },
            {
                model: HorarioAtencion,
                as: "Horarios",
                required: true,
                attributes: ["horaInicio", "horaFin", "duracionTurno", "dia"],
                where: {
                    ...(horaInicio && { horaInicio: { [Op.gte]: horaInicio } }),
                    ...(horaFin && { horaFin: { [Op.lte]: horaFin } }),
                    ...(duracion && { duracionTurno: duracion }),
                    ...(dia && { where: { dia } }),
                },
            },
        ],
    };

    const { count, rows: agendas } = await AgendaTurnos.findAndCountAll(
        queryOptions
    );

    const agendasFormateadas = agendas.map((agenda) => {
        return formatearAgenda(agenda);
    });

    res.status(200).json({
        total: count,
        page: page,
        limit: limit,
        items: agendasFormateadas,
    });
};

const formatearAgenda = (agenda) => {

    const prestador = {
        id: agenda.Prestador.id,
        nombre: agenda.Prestador.nombre,
        especialidades: agenda.Prestador.Especialidad.map(
            e => ({
                id: e.id,
                nombre: e.nombre
            })
        ),
        horarios: agenda.Prestador.CentroDeAtencion.find(lugar => lugar.id === agenda.lugarAtencionId).Horarios
    }

    const horarios = agenda.Horarios;

    const direccionData = agenda.CentroDeAtencion.Direccion;

    const provincia = direccionData.Provincia;

    const direccion = {
        calle: direccionData.calle,
        altura: direccionData.altura,
        pisoDepto: direccionData.pisoDepto,
        localidad: direccionData.localidad,
        provincia: provincia.nombre,
    };

    const agendaNueva = {
        id: agenda.id,
        prestador: prestador,
        especialidad: agenda.Especialidad.nombre,
        horariosAtencion: horarios,
        direccion: direccion,
        createdAt: agenda.createdAt,
        updatedAt: agenda.updatedAt
    };
    return { ...agendaNueva };
};

const obtenerUnaAgendaTurnos = async (req, res) => {
    const { id } = req.params;
    const agenda = await AgendaTurnos.findByPk(id, {
        include: [
            { model: Prestador, as: "Prestador", include: [{ model: Especialidad, as: "Especialidad" }, { model: LugarAtencion, as: "CentroDeAtencion", include: [{ model: HorarioAtencion, as: "Horarios" }] }] },
            { model: Especialidad, as: "Especialidad" },
            {
                model: LugarAtencion,
                as: "CentroDeAtencion",
                include: [{ model: Direccion, as: "Direccion", include: { model: Provincia, as: "Provincia" } }],
            },
            { model: HorarioAtencion, as: "Horarios" },
        ],
    });
    res.status(200).json(formatearAgenda(agenda));
};

const actualizarHorariosDeAgendaTurnos = async (req, res) => {

    const { id } = req.params;
    const { horarios } = req.body;

    const agendaTurnos = await AgendaTurnos.findByPk(id, {
        include: [{ model: HorarioAtencion, as: 'Horarios' }]
    });

    // Eliminar solo los horarios asociados a esta agenda
    await HorarioAtencion.destroy({
        where: { agendaTurnosId: id },
    });

    // Crear nuevos horarios (independientes de los del prestador)
    for (const horario of horarios) {

        for (const dia of horario.dias) {

            const nuevoHorario = await HorarioAtencion.create({
                agendaTurnosId: id,
                lugarAtencionId: null,
                horaInicio: horario.horaInicio,
                horaFin: horario.horaFin,
                duracionTurno: horario.duracion,
                dia: dia
            });

        }

    }

    // Recargar agenda con los horarios nuevos
    const agendaActualizada = await AgendaTurnos.findByPk(id, {
        include: [{ model: HorarioAtencion, as: 'Horarios' }]
    });

    return res.status(200).json(agendaActualizada);

};


const actualizarEspecialidadDeAgendaTurnos = async (req, res) => {
    const { id } = req.params;
    const { especialidadId } = req.body;

    const agendaTurnos = await AgendaTurnos.findByPk(id, { include: { model: Especialidad, as: "Especialidad" } });

    agendaTurnos.especialidadId = especialidadId;

    await agendaTurnos.save();

    console.log(agendaTurnos);

    res.status(200).json(agendaTurnos);
};

const eliminarAgendaTurnos = async (req, res) => {
    const { id } = req.params;

    const agendaTurnos = await AgendaTurnos.findByPk(id, {
        include: { model: HorarioAtencion, as: 'Horarios' },
    });

    await HorarioAtencion.destroy({ where: { agendaTurnosId: id } });

    await AgendaTurnos.destroy({ where: { id } });

    res.status(200).json({ message: "Agenda de turnos eliminada correctamente" });
};

const obtenerLocalidadesAgendas = async (_, res) => {
    const agendas = await AgendaTurnos.findAll({
        include: [
            {
                model: LugarAtencion, as: "CentroDeAtencion",
                include: [{ model: Direccion }],
            },
        ],
    });

    const setLocalidades = new Set();

    agendas.forEach((agenda) => {
        const localidad = agenda.CentroDeAtencion?.Direccion?.localidad;
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
                model: LugarAtencion, as: "CentroDeAtencion",
                include: [{ model: Direccion, include: [{ model: Provincia, as: "Provincia" }] }],
            },
        ],
    });

    const setProvincias = new Set();

    agendas.forEach((agenda) => {
        const provincia = agenda.CentroDeAtencion?.Direccion?.Provincia.nombre;
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
    actualizarHorariosDeAgendaTurnos,
    actualizarEspecialidadDeAgendaTurnos,
    eliminarAgendaTurnos,
    obtenerLocalidadesAgendas,
    obtenerProvinciasAgendas,
};

