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

    const nuevaAgendaTurnos = await AgendaTurnos.create();

    const nuevaAgendaTurnosId = nuevaAgendaTurnos.id;

    relacionarAgendaConDemasEntidades(nuevaAgendaTurnosId, prestadorId, especialidadId, lugaratencionId);

    for (const horario of horarios) {
        const nuevoHorario = await HorarioAtencion.create({
            agendaTurnosId: nuevaAgendaTurnosId,
            horaInicio: horario.horaInicio,
            horaFin: horario.horaFin,
            duracionTurno: horario.duracion
        });

        for (const diaId of horario.dias) {
            const diaExistente = await Dia.findByPk(diaId);
            if (diaExistente) {
                await nuevoHorario.addDia(diaExistente); // Usamos addDia para agregar un solo día
            }
        }
    }

    res.status(201).json(nuevaAgendaTurnos);

}

const relacionarAgendaConDemasEntidades = async (agendaId, prestadorId, especialidadId, lugarAtencionId) => {
    await AgendaTurnos.update({
        prestadorId,
        especialidadId,
        lugarAtencionId
    }, {
        where: { id: agendaId }
    });
}

const obtenerAgendasTurnos = async (req, res) => {
    const agendas = await AgendaTurnos.findAll({
        include: [
            { model: Prestador },
            { model: Especialidad },
            { model: LugarAtencion, include: [{ model: Direccion, include: [Provincia] }] },
            { model: HorarioAtencion, include: { model: Dia } }
        ]
    });
    res.status(200).json(agendas);
};

const obtenerAgendasTurnosFormateados = async (req, res) => {
    const agendas = await AgendaTurnos.findAll({
        include: [
            { model: Prestador },
            { model: Especialidad },
            { model: LugarAtencion, include: [{ model: Direccion, include: [Provincia] }] },
            { model: HorarioAtencion, include: { model: Dia } }
        ]
    });

    const agendasFormateadas = agendas.map(agenda => {

        const horarios = agenda.HorarioAtencions.map(horario => ({
            dias: horario.Dia.map(dia => dia.nombre),
            horaInicio: horario.horaInicio,
            horaFin: horario.horaFin,
            duracion: horario.duracionTurno
        }));

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
            prestador: agenda.Prestador.nombre,
            especialidad: agenda.Especialidad.nombre,
            horariosAtencion: horarios,
            direccion: direccion
        }
        return { ...agendaNueva };
    });
    res.status(200).json(agendasFormateadas);
}

const obtenerUnaAgendaTurnos = async (req, res) => {
    const { id } = req.params;
    const agenda = await AgendaTurnos.findByPk(id, {
        include: [
            { model: Prestador },
            { model: Especialidad },
            { model: LugarAtencion, include: [{ model: Direccion, include: [Provincia] }] },
            { model: HorarioAtencion, include: { model: Dia } }
        ]
    });
    res.status(200).json(agenda);
};

const actualizarAgendaTurnos = async (req, res) => {
    const { id } = req.params;
    const { horarios } = req.body;

    const agendaTurnos = await AgendaTurnos.findByPk(id, {include: [HorarioAtencion]});

    const entidadesRelacionadas = [Prestador, Especialidad, LugarAtencion];

    entidadesRelacionadas.forEach(async (entidad) => {
        const idModelo = req.body[entidad.name.toLowerCase() + "Id"];
        if (idModelo) { // si hay algun dato para actualizar
            const nombreAtributo = entidad.name[0].toLowerCase() + entidad.name.slice(1) + "Id"; // ej: lugarAtencionId
            await AgendaTurnos.update({ [nombreAtributo]: idModelo }, { where: { id } }); // actualizo el atributo correspondiente
        }
    });

    for (const horario of agendaTurnos.HorarioAtencions) {
        await horario.setDia([]);
    }
    await HorarioAtencion.destroy({ where: { agendaTurnosId: id } });

    for (const horario of horarios) {
        const nuevoHorario = await HorarioAtencion.create({
            agendaTurnosId: id,
            horaInicio: horario.horaInicio,
            horaFin: horario.horaFin,
            duracionTurno: horario.duracion
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

    const agendaTurnos = await AgendaTurnos.findByPk(id, {include: [HorarioAtencion]});

    for (const horario of agendaTurnos.HorarioAtencions) {
        await horario.setDia([]);
    }

    await HorarioAtencion.destroy({ where: { agendaTurnosId: id } });

    await AgendaTurnos.destroy({ where: { id } });

    res.status(200).json({ message: "Agenda de turnos eliminada correctamente" });
}

module.exports = {
    crearAgendaTurnos,
    obtenerAgendasTurnos,
    obtenerAgendasTurnosFormateados,
    obtenerUnaAgendaTurnos,
    actualizarAgendaTurnos,
    eliminarAgendaTurnos
};