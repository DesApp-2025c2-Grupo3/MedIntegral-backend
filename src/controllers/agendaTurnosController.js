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
        prestador,
        especialidad,
        lugarAtencion,
        horarios,
        duracion
    } = req.body;

    const nuevaAgendaTurnos = await AgendaTurnos.create({
        duracion
    });

    const nuevaAgendaTurnosId = nuevaAgendaTurnos.id;

    relacionarAgendaConDemasEntidades(nuevaAgendaTurnosId, prestador, especialidad, lugarAtencion);

    for (const horario of horarios) {
        const nuevoHorario = await HorarioAtencion.create({
            agendaTurnosId: nuevaAgendaTurnosId,
            horaInicio: horario.horaInicio,
            horaFin: horario.horaFin
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
    const prestador = await Prestador.findByPk(prestadorId);
    const especialidad = await Especialidad.findByPk(especialidadId);
    const lugarAtencion = await LugarAtencion.findByPk(lugarAtencionId);
    if (prestador && especialidad && lugarAtencion) {
        await AgendaTurnos.update({
            prestadorId: prestador.id,
            especialidadId: especialidad.id,
            lugarAtencionId: lugarAtencion.id
        }, {
            where: { id: agendaId }
        });
    } else {
        throw new Error("Prestador, Especialidad o Lugar de Atención no encontrado.");
    }
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
            horaFin: horario.horaFin
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
            direccion: direccion,
            duracion: agenda.duracion
        }
        return { ...agendaNueva };
    });
    res.status(200).json(agendasFormateadas);
}


module.exports = { crearAgendaTurnos, obtenerAgendasTurnos, obtenerAgendasTurnosFormateados };