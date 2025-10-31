const {
    HorarioAtencion,
    AgendaTurnos,
    Dia,
    Prestador,
    Especialidad,
    LugarAtencion,
    Direccion,
    Provincia
} = require("../db/models");

const crearAgendaTurnos = async (req, res) => {
    const {
        prestadorId,
        especialidadId,
        lugaratencionId,
        horarios,
    } = req.body;

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

}

const obtenerAgendasTurnos = async (req, res) => {
    const agendas = await AgendaTurnos.findAll({
        include: [
            { model: Prestador, attributes: ["nombre"] },
            { model: Especialidad, attributes: ["nombre"] },
            { model: LugarAtencion, attributes: { exclude: ["createdAt", "updatedAt"] }, include: [{ model: Direccion, attributes: ["calle", "altura", "pisoDepto", "localidad"], include: { model: Provincia, attributes: ["nombre"] } }] },
            { model: HorarioAtencion }
        ], attributes: { exclude: ["createdAt", "updatedAt"] }
    });
    res.status(200).json(agendas);
};

const obtenerAgendasTurnosFormateados = async (req, res) => {
    const agendas = await AgendaTurnos.findAll({
        include: [
            { model: Prestador, include: [{ model: Especialidad }, { model: LugarAtencion, include: [{ model: HorarioAtencion }] }] },
            { model: Especialidad },
            { model: LugarAtencion, include: [{ model: Direccion, include: [Provincia] }, { model: HorarioAtencion }] },
            { model: HorarioAtencion }
        ]
    });

    const agendasFormateadas = agendas.map(agenda => {
        return formatearAgenda(agenda);
    });
    res.status(200).json(agendasFormateadas);
}

const obtenerUnaAgendaTurnos = async (req, res) => {
    const { id } = req.params;
    const agenda = await AgendaTurnos.findByPk(id, {
        include: [
            { model: Prestador, include: [{ model: Especialidad }, { model: LugarAtencion, include: [{ model: HorarioAtencion }] }] },
            { model: Especialidad },
            { model: LugarAtencion, include: [{ model: Direccion, include: [Provincia] }, { model: HorarioAtencion }] },
            { model: HorarioAtencion }
        ]
    });
    res.status(200).json(formatearAgenda(agenda));
};

const formatearAgenda = (agenda) => {
    // console.log(" ---- Horarios del prestador ---- ");
    // console.log(agenda.Prestador.LugarAtencions);
    // console.log(" -------------------------------- ");
    // console.log(agenda.Prestador.LugarAtencions.find(lugar => lugar.id === agenda.lugarAtencionId));
    // console.log(" -------------------------------- ");
    // console.log(agenda.Prestador.LugarAtencions.find(lugar => lugar.id === agenda.lugarAtencionId).HorarioAtencions);
    const prestador = {
        id: agenda.Prestador.id,
        nombre: agenda.Prestador.nombre,
        especialidades: agenda.Prestador.Especialidads.map(especialidad => ({
            id: especialidad.id,
            nombre: especialidad.nombre
        })),
        horarios: agenda.Prestador.LugarAtencions.find(lugar => lugar.id === agenda.lugarAtencionId).HorarioAtencions
    }

    const horarios = agenda.HorarioAtencions;

    const direccionData = agenda.LugarAtencion.Direccion;

    const provincia = direccionData.Provincium;

    const direccion = {
        calle: direccionData.calle,
        altura: direccionData.altura,
        pisoDepto: direccionData.pisoDepto,
        localidad: direccionData.localidad,
        provincia: provincia.nombre
    }

    const agendaNueva = {
        id: agenda.id,
        prestador: prestador,
        especialidad: agenda.Especialidad.nombre,
        horariosAtencion: horarios,
        direccion: direccion,
        createdAt: agenda.createdAt,
        updatedAt: agenda.updatedAt
    }
    return { ...agendaNueva };
};

const actualizarHorariosDeAgendaTurnos = async (req, res) => {

    const { id } = req.params;
    const { horarios } = req.body;

    const agendaTurnos = await AgendaTurnos.findByPk(id, {
        include: [{ model: HorarioAtencion }]
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
        include: [{ model: HorarioAtencion }]
    });

    return res.status(200).json(agendaActualizada);

};


const actualizarEspecialidadDeAgendaTurnos = async (req, res) => {
    const { id } = req.params;
    const { especialidadId } = req.body;

    const agendaTurnos = await AgendaTurnos.findByPk(id, { include: [Especialidad] });

    agendaTurnos.especialidadId = especialidadId;

    await agendaTurnos.save();

    console.log(agendaTurnos);

    res.status(200).json(agendaTurnos);
};

const eliminarAgendaTurnos = async (req, res) => {
    const { id } = req.params;

    const agendaTurnos = await AgendaTurnos.findByPk(id, { include: [HorarioAtencion] });

    await HorarioAtencion.destroy({ where: { agendaTurnosId: id } });

    await AgendaTurnos.destroy({ where: { id } });

    res.status(200).json({ message: "Agenda de turnos eliminada correctamente" });
}

module.exports = {
    crearAgendaTurnos,
    obtenerAgendasTurnos,
    obtenerAgendasTurnosFormateados,
    obtenerUnaAgendaTurnos,
    eliminarAgendaTurnos,
    actualizarHorariosDeAgendaTurnos,
    actualizarEspecialidadDeAgendaTurnos
};