const {
    HorarioAtencion,
    AgendaTurnos,
    Prestador,
    Especialidad,
    LugarAtencion,
    Direccion,
    Provincia,
    Email,
    Telefono
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
                        attributes: ["horaInicio", "horaFin", "dia"]
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
                    ...(dia && { dia: dia }),
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

    const especialidad = {
        id: agenda.Especialidad.id,
        nombre: agenda.Especialidad.nombre
    }

    const agendaNueva = {
        id: agenda.id,
        prestador: prestador,
        especialidad: especialidad,
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
                include: [{ model: Direccion, as: "Direccion" }],
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

const formatearPrestador = (prestador) => {

    const lugares = prestador.CentroDeAtencion.map((lugar) => ({
        id: lugar.id,
        calle: lugar.Direccion.calle,
        altura: lugar.Direccion.altura,
        pisoDepto: lugar.Direccion.pisoDepto,
        localidad: lugar.Direccion.localidad,
        provincia: lugar.Direccion.Provincia.nombre,
        horarios: lugar.Horarios,
    }));

    const prestadorFormateado = {
        id: prestador.id,
        nombre: prestador.nombre,
        especialidades: prestador.Especialidad,
        centrosDeAtencion: lugares,
    };

    return {...prestadorFormateado};
}

const obtenerIdPrestadoresConAgenda = async () => {
    const prestadoresConAgenda = await AgendaTurnos.findAll({
        attributes: ["prestadorId"],
        group: ["prestadorId"]
    });
    return prestadoresConAgenda.map(pa => pa.prestadorId);
};

const obtenerIdPrestadoresSinAgenda = async () => {
    const idsDePrestadoresConAgenda = obtenerIdPrestadoresConAgenda();

    const prestadores = await Prestador.findAll({
        attributes: ["id", "nombre"],
    });
    return prestadores.filter(p => !idsDePrestadoresConAgenda.includes(p.id)).map(p => p.id);
};

const obtenerPrestadoresConAgendaIncompleta = async (req, res) => {

    let idsDePrestadoresConAgenda;
    obtenerIdPrestadoresConAgenda().then(ids => idsDePrestadoresConAgenda = ids);

    const agendas = await AgendaTurnos.findAll({
        include: [
            { model: Prestador, as: "Prestador", include: [{ model: Especialidad, as: "Especialidad" }, { model: LugarAtencion, as: "CentroDeAtencion", include: [{ model: HorarioAtencion, as: "Horarios" }] }] },
            { model: Especialidad, as: "Especialidad" },
            { model: LugarAtencion, as: "CentroDeAtencion", include: { model: Direccion, as: "Direccion", include: { model: Provincia, as: "Provincia" } }, },
            { model: HorarioAtencion, as: "Horarios" },
        ],
    });

    const prestadores = await Prestador.findAll({
        include: [
            { model: Especialidad, as: "Especialidad" },
            {
                model: LugarAtencion, as: "CentroDeAtencion", include: [
                    { model: Direccion, as: "Direccion", include: { model: Provincia, as: "Provincia" } },
                    { model: HorarioAtencion, as: "Horarios" }]
            }
        ]
    });

    const idPrestadoresConAgendaCompleta = prestadores
        .filter(p => idsDePrestadoresConAgenda.includes(p.id))
        .filter(p => compararAgendaConPrestador(agendas, p))
        .map(p => p.id);

    const idPrestadoresConAgendaIncompleta = prestadores.filter(p => !idPrestadoresConAgendaCompleta.includes(p.id)).map(p => p.id);

    const prestadoresConAgendaIncompleta = prestadores.filter(p => idPrestadoresConAgendaIncompleta.includes(p.id)).map(p => {
        return formatearPrestador(p)
    });
    return res.status(200).json(prestadoresConAgendaIncompleta);
};

const convertirAMinutos = (horario) => {
    const [hora, minutos] = horario.split(":").map(Number);
    return hora * 60 + minutos;
}

const compararAgendaConPrestador = (agendas, prestador) => {
    let horarios = prestador.CentroDeAtencion.flatMap(lugar => lugar.Horarios.map(h => { return { dia: h.dia, horaInicio: h.horaInicio, horaFin: h.horaFin } }));
console.log("centros de atencion del prestador")
console.log(prestador.CentroDeAtencion)

    agendas.forEach(a => {
        if (a.Prestador.id === prestador.id) {
            console.log("centros de atencion de la agenda")
            console.log(a.CentroDeAtencion)
            prestador.CentroDeAtencion.find(lugar => lugar.id === a.CentroDeAtencion.id).Horarios.forEach(hp => {
                a.Horarios.forEach(ha => {
                    if (mismoDia(hp, ha) && minutosDeDiferenciaInicio(hp, ha) === 0 && minutosDeDiferenciaFin(hp, ha) === 0) {
                        horarios.filter(h => !(h.dia === ha.dia && h.horaInicio === ha.inicio && h.horaFin === ha.fin));
                    }
                });
            });
        }
    });
    return horarios.length === 0;
};

const mismoDia = (hp, ha) => {
    return hp.dia === ha.dia
}

const minutosDeDiferenciaInicio = (hp, ha) => {
    return convertirAMinutos(ha.horaInicio) - convertirAMinutos(hp.horaInicio);
}

const minutosDeDiferenciaFin = (hp, ha) => {
    return convertirAMinutos(hp.horaFin) - convertirAMinutos(ha.horaFin);
}

module.exports = {
    crearAgendaTurnos,
    obtenerAgendasTurnos,
    obtenerAgendasTurnosFormateados,
    obtenerUnaAgendaTurnos,
    actualizarHorariosDeAgendaTurnos,
    actualizarEspecialidadDeAgendaTurnos,
    eliminarAgendaTurnos,
    obtenerLocalidadesAgendas,
    obtenerPrestadoresConAgendaIncompleta
};

