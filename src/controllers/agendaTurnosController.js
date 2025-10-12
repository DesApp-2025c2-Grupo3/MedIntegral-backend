const {
    HorarioAtencion,
    AgendaTurnos,
    Dia,
    Prestador,
    Especialidad,
    LugarAtencion
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
    console.log(prestador);
    console.log(especialidad);
    console.log(lugarAtencion);
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
            { model: LugarAtencion },
            {
                model: HorarioAtencion,
                include: [Dia]
            }
        ]
    });
    res.status(200).json(agendas);
};

module.exports = { crearAgendaTurnos, obtenerAgendasTurnos };