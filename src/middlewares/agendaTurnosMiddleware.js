const { Op } = require("sequelize");
const { errorPersonalizado } = require('./genericMiddleware');
const { AgendaTurnos, Prestador, LugarAtencion, HorarioAtencion, Especialidad } = require("../db/models");
const { convertirAMinutos, horariosCorrectos, noSeSuperponenHorarios } = require("../services/horarioService");

const validarHorarios = async (req, res, next) => {
    const { horarios } = req.body;

    // Validar que cada horario tenga hora de fin mayor a hora de inicio
    for (const horario of horarios) {
        horariosCorrectos(horario, next);
    }

    // Validar que los horarios no se superpongan
    noSeSuperponenHorarios(horarios, next);

    next();
}


const validarLosHorariosEntreAgendasYPrestadores = async (req, res, next) => {

    const { horarios } = req.body;

    const prestador = await Prestador.findByPk(req.body.prestadorId, {
        include: [{ model: LugarAtencion, as: 'CentroDeAtencion', include: [{ model: HorarioAtencion, as: 'Horarios' }] }]
    });

    const horariosPrestador = prestador.CentroDeAtencion.find(lugar => lugar.id === req.body.lugaratencionId).Horarios;

    const diasDeHorariosPrestador = horariosPrestador.map(h => h.dia);

    for (const horarioPrestador of horariosPrestador) {

        for (const horarioAgenda of horarios) {

            for (const diaAgenda of horarioAgenda.dias) {

                if (!diasDeHorariosPrestador.includes(diaAgenda)) {
                    return errorPersonalizado(`El día ${diaAgenda} de la agenda no está dentro de los días de atención del prestador`, 400, next);
                }

                if (diaAgenda === horarioPrestador.dia) {
                    if (!(convertirAMinutos(horarioAgenda.horaInicio) >= convertirAMinutos(horarioPrestador.horaInicio) &&
                        convertirAMinutos(horarioAgenda.horaFin) <= convertirAMinutos(horarioPrestador.horaFin))) {

                        return errorPersonalizado(`El horario ${diaAgenda} ${horarioAgenda.horaInicio}-${horarioAgenda.horaFin} de la agenda no está dentro de los horarios del prestador`, 400, next);

                    }
                }


            }

        }

    }

    next();
};

const validarQueElLugarTengaRelacionConElPrestador = async (req, res, next) => {

    const { prestadorId, lugaratencionId } = req.body;
    const prestador = await Prestador.findByPk(prestadorId, {
        include: [{ model: LugarAtencion, as: 'CentroDeAtencion' }]
    });

    if (prestador.CentroDeAtencion.filter(lugar => lugar.id === req.body.lugaratencionId).length === 0) {
        return errorPersonalizado(`El lugar de atención con id ${lugaratencionId} no pertenece al prestador con id ${prestadorId}`, 400, next);
    }

    next();
};

const validarQueLaEspecialidadTengaRelacionConElPrestador = async (req, res, next) => {

    const { prestadorId, especialidadId } = req.body;
    const prestador = await Prestador.findByPk(prestadorId, {
        include: [{ model: Especialidad, as: 'Especialidad' }]
    });

    if (prestador.Especialidad.filter(especialidad => especialidad.id === especialidadId).length === 0) {
        return errorPersonalizado(`La especialidad con id ${especialidadId} no pertenece al prestador con id ${prestadorId}`, 400, next);
    }

    next();
};

const validarQueNoExistaUnaAgendaConElMismoPrestadorMismoLugarYMismaEspecialidad = async (req, res, next) => {

    const { prestadorId, especialidadId } = req.body;
    let { lugaratencionId } = req.body;
    const { id } = req.params;

    const IS_UPDATE = !!id;
    
    if (IS_UPDATE) {
        const agendaActual = await AgendaTurnos.findOne({
            where: { id }
        });

        if (!agendaActual) {
            return errorPersonalizado("La agenda no existe", 404, next);
        }

        lugaratencionId = agendaActual.lugarAtencionId;
    }

    const where = {
        prestadorId,
        lugarAtencionId: lugaratencionId,
        especialidadId,
    };

    if (IS_UPDATE) {
        where.id = { [Op.ne]: id }; 
    }

    const agendaExistente = await AgendaTurnos.findOne({ where });

    if (agendaExistente) {
        return errorPersonalizado(`Ya existe la agenda #${agendaExistente.id}# para el prestador con id ${prestadorId} en el lugar de atención con id ${lugaratencionId} y con la especialidad con id ${especialidadId}`, 400, next);
    }

    next();
};

const validarQueExistaElPrestador = async (req, res, next) => {

    const { prestadorId } = req.params;

    const prestador = await Prestador.findByPk(prestadorId);

    if (!prestador) {
        return errorPersonalizado(`No existe el prestador con id ${prestadorId}`, 404, next);
    }

    next();
}

module.exports = {
    validarLosHorariosEntreAgendasYPrestadores,
    validarQueElLugarTengaRelacionConElPrestador,
    validarQueLaEspecialidadTengaRelacionConElPrestador,
    validarQueNoExistaUnaAgendaConElMismoPrestadorMismoLugarYMismaEspecialidad,
    validarHorarios,
    validarQueExistaElPrestador
};

//al crear agendas se saca de disponibilidad, y al modificar o eliminar agendas se vuelve a poner en disponibilidad