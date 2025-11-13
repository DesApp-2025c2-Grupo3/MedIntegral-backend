const {
    HorarioAtencion,
    AgendaTurnos,
    Prestador,
    Especialidad,
    LugarAtencion,
    Direccion,
    Provincia
} = require("../db/models");
const { convertirAMinutos } = require("../services/horarioService");

const { Op } = require("sequelize");

const crearAgendaTurnos = async (req, res) => {
    const { prestadorId, especialidadId, lugaratencionId, horarios } = req.body;

    const prestador = await Prestador.findByPk(prestadorId, {
        include: [{ model: LugarAtencion, as: 'CentroDeAtencion', include: [{ model: HorarioAtencion, as: 'Horarios' }] }]
    });

    const horariosDelPrestadorEnEseLugar = prestador.CentroDeAtencion.find(lugar => lugar.id === lugaratencionId).Horarios;

    const nuevaAgendaTurnos = await AgendaTurnos.create({

        prestadorId: prestadorId,
        especialidadId: especialidadId,
        lugarAtencionId: lugaratencionId

    });

    const nuevaAgendaTurnosId = nuevaAgendaTurnos.id;

    let nuevoHorarioInicioDisponible;
    let nuevoHorarioFinDisponible;

    for (const horario of horarios) {

        for (const dia of horario.dias) {

            for (const horarioPrestador of horariosDelPrestadorEnEseLugar) {

                if (horarioPrestador.dia === dia) {

                    if (convertirAMinutos(horarioPrestador.horaInicio) <= convertirAMinutos(horario.horaInicio) &&
                        convertirAMinutos(horarioPrestador.horaFin) >= convertirAMinutos(horario.horaFin) &&
                        horarioPrestador.disponible === true) {

                        const nuevoHorarioAgenda = await HorarioAtencion.create({
                            agendaTurnosId: nuevaAgendaTurnosId,
                            lugarAtencionId: null,
                            horaInicio: horario.horaInicio,
                            horaFin: horario.horaFin,
                            duracionTurno: horario.duracion,
                            dia: dia
                        });

                        const horarioAActualizar = await HorarioAtencion.findByPk(horarioPrestador.id);
                        await horarioAActualizar.update({ disponible: false });

                        if (convertirAMinutos(horarioPrestador.horaInicio) != convertirAMinutos(horario.horaInicio)) {

                            nuevoHorarioInicioDisponible = await HorarioAtencion.create({
                                agendaTurnosId: null,
                                lugarAtencionId: lugaratencionId,
                                horaInicio: horarioPrestador.horaInicio,
                                horaFin: horario.horaInicio,
                                dia: dia,
                                disponible: true,
                                esParcial: true

                            });

                        }

                        if (convertirAMinutos(horarioPrestador.horaFin) != convertirAMinutos(horario.horaFin)) {

                            nuevoHorarioFinDisponible = await HorarioAtencion.create({
                                agendaTurnosId: null,
                                lugarAtencionId: lugaratencionId,
                                horaInicio: horario.horaFin,
                                horaFin: horarioPrestador.horaFin,
                                dia: dia,
                                disponible: true,
                                esParcial: true
                            });

                        }

                    }

                }

            }

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
        ],
        order: [
            ["updatedAt", "DESC"],
        ]
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
        order: [["updatedAt", "DESC"]],
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
            { model: Prestador, as: "Prestador", include: [{ model: Especialidad, as: "Especialidad" }, { model: LugarAtencion, as: "CentroDeAtencion", include: [{ model: HorarioAtencion, as: "Horarios", where: { disponible: true }, required: false }] }] },
            { model: Especialidad, as: "Especialidad" },
            {
                model: LugarAtencion,
                as: "CentroDeAtencion",
                include: [{ model: Direccion, as: "Direccion", include: { model: Provincia, as: "Provincia" } }],
            },
            { model: HorarioAtencion, as: "Horarios" },
        ],
    });

    const horariosDeAgenda = agenda.Horarios;

    horariosDeAgenda.forEach( h => {
        agenda.Prestador.CentroDeAtencion.find(lugar => lugar.id === agenda.lugarAtencionId).Horarios.push(h);
    });

    res.status(200).json(formatearAgenda(agenda));
};

const actualizarHorariosDeAgendaTurnos = async (req, res) => {

    const { id } = req.params;
    const { horarios } = req.body;

    const agendaTurnos = await AgendaTurnos.findByPk(id, {
        include: [
            { model: Prestador, as: "Prestador", include: [{ model: LugarAtencion, as: "CentroDeAtencion", include: [{ model: HorarioAtencion, as: "Horarios" }] }] },
            { model: HorarioAtencion, as: 'Horarios' }
        ]
    });

    // Eliminar solo los horarios asociados a esta agenda
    await HorarioAtencion.destroy({
        where: { agendaTurnosId: id },
    });

    const prestador = await Prestador.findByPk(agendaTurnos.prestadorId, {
        include: [{ model: LugarAtencion, as: 'CentroDeAtencion', include: [{ model: HorarioAtencion, as: 'Horarios' }] }]
    });

    //hacer disponibles los horarios y borrar los superpuestos
    prestador.CentroDeAtencion.find(lugar => lugar.id === agendaTurnos.lugarAtencionId).Horarios.map(async h => {
        if (h.disponible === false) {
            await HorarioAtencion.update({ disponible: true }, { where: { id: h.id } });
        }
        if (h.esParcial === true) {
            await HorarioAtencion.destroy({ where: { id: h.id } });
        }
    });

    const horariosDelPrestadorEnEseLugar = agendaTurnos.Prestador.CentroDeAtencion.find(lugar => lugar.id === agendaTurnos.lugarAtencionId).Horarios;

    let nuevoHorarioInicioDisponible;
    let nuevoHorarioFinDisponible;

    for (const horario of horarios) {

        for (const dia of horario.dias) {

            for (const horarioPrestador of horariosDelPrestadorEnEseLugar) {

                if (horarioPrestador.dia === dia) {

                    if (convertirAMinutos(horarioPrestador.horaInicio) <= convertirAMinutos(horario.horaInicio) &&
                        convertirAMinutos(horarioPrestador.horaFin) >= convertirAMinutos(horario.horaFin) &&
                        horarioPrestador.disponible === true) {

                        const nuevoHorarioAgenda = await HorarioAtencion.create({
                            agendaTurnosId: id,
                            lugarAtencionId: null,
                            horaInicio: horario.horaInicio,
                            horaFin: horario.horaFin,
                            duracionTurno: horario.duracion,
                            dia: dia
                        });

                        const horarioAActualizar = await HorarioAtencion.findByPk(horarioPrestador.id);
                        await horarioAActualizar.update({ disponible: false });

                        if (convertirAMinutos(horarioPrestador.horaInicio) != convertirAMinutos(horario.horaInicio)) {

                            nuevoHorarioInicioDisponible = await HorarioAtencion.create({
                                agendaTurnosId: null,
                                lugarAtencionId: agendaTurnos.lugarAtencionId,
                                horaInicio: horarioPrestador.horaInicio,
                                horaFin: horario.horaInicio,
                                dia: dia,
                                disponible: true,
                                esParcial: true

                            });

                        }

                        if (convertirAMinutos(horarioPrestador.horaFin) != convertirAMinutos(horario.horaFin)) {

                            nuevoHorarioFinDisponible = await HorarioAtencion.create({
                                agendaTurnosId: null,
                                lugarAtencionId: agendaTurnos.lugarAtencionId,
                                horaInicio: horario.horaFin,
                                horaFin: horarioPrestador.horaFin,
                                dia: dia,
                                disponible: true,
                                esParcial: true
                            });

                        }

                    }

                }

            }

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

    await AgendaTurnos.update({ especialidadId }, { where: { id } });

    res.status(200).json({ message: "Agenda de turnos modificada correctamente" });
};

//al crear agendas se saca de disponibilidad, y al modificar o eliminar agendas se vuelve a poner en disponibilidad
const eliminarAgendaTurnos = async (req, res) => {
    const { id } = req.params;

    const agendaTurnos = await AgendaTurnos.findByPk(id, {
        include: [
            { model: Prestador, as: "Prestador", include: [{ model: LugarAtencion, as: "CentroDeAtencion", include: [{ model: HorarioAtencion, as: "Horarios" }] }] },
            { model: HorarioAtencion, as: 'Horarios' }
        ]
    });

    const prestador = await Prestador.findByPk(agendaTurnos.prestadorId, {
        include: [{ model: LugarAtencion, as: 'CentroDeAtencion', include: [{ model: HorarioAtencion, as: 'Horarios' }] }]
    });

    //hacer disponibles los horarios y borrar los superpuestos
    prestador.CentroDeAtencion.find(lugar => lugar.id === agendaTurnos.lugarAtencionId).Horarios.map(async h => {
        if (h.disponible === false) {
            await HorarioAtencion.update({ disponible: true }, { where: { id: h.id } });
        }
        if (h.esParcial === true) {
            await HorarioAtencion.destroy({ where: { id: h.id } });
        }
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

const obtenerProvinciasAgendas = async (_, res) => {
    const agendas = await AgendaTurnos.findAll({
        include: [
            {
                model: LugarAtencion, as: "CentroDeAtencion",
                include: [{
                    model: Direccion, as: "Direccion",
                    include: [{ model: Provincia, as: "Provincia" }]
                }],
            },
        ],
    });

    const setProvincias = new Set();

    agendas.forEach((agenda) => {
        const provincia = agenda.CentroDeAtencion?.Direccion?.Provincia;
        if (provincia) {
            setProvincias.add(provincia.nombre);
        }
    });


    const provinciasFormateadas = Array.from(setProvincias).map(
        (provincia) => ({
            value: provincia,
            label: provincia,
        })
    );

    res.status(200).json(provinciasFormateadas);
};

const formatearPrestador = (prestador) => {

    const lugares = prestador.CentroDeAtencion.map((lugar) => ({
        id: lugar.id,
        calle: lugar.Direccion.calle,
        altura: lugar.Direccion.altura,
        pisoDepto: lugar.Direccion.pisoDepto,
        localidad: lugar.Direccion.localidad,
        provincia: lugar.Direccion.Provincia.nombre,
        horarios: obtenerHorariosDisponibles(lugar.Horarios),
    }));

    const prestadorFormateado = {
        id: prestador.id,
        nombre: prestador.nombre,
        especialidades: prestador.Especialidad,
        centrosDeAtencion: lugares,
    };

    return { ...prestadorFormateado };
}

const obtenerHorariosDisponibles = (horarios) => {
    return horarios.filter(horario => horario.disponible === true);
}

const obtenerPrestadoresConAgendaIncompleta = async (req, res) => {

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

    const prestadoresConDisponibilidad = prestadores.filter(p =>
        p.CentroDeAtencion.some(lugar =>
            lugar.Horarios.some(horario => horario.disponible === true)
        )
    );

    const prestadoresConAgendaIncompleta = prestadoresConDisponibilidad.map(p => {
        return formatearPrestador(p)
    });
    return res.status(200).json(prestadoresConAgendaIncompleta);
};

// Obtener prestador por id
const obtenerPrestador = async (req, res) => {
    const { prestadorId } = req.params;

    const prestador = await Prestador.findByPk(prestadorId, {
        include: [
            {
                model: Especialidad,
                as: "Especialidad"
            },
            {
                model: LugarAtencion,
                as: "CentroDeAtencion",
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
                    },
                ],
            },
        ],
    });

    return res.status(200).json(formatearPrestador(prestador));
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
    obtenerPrestadoresConAgendaIncompleta,
    obtenerPrestador
};

