const { errorPersonalizado } = require('./genericMiddleware');
const { AgendaTurnos, Prestador, LugarAtencion, HorarioAtencion, Especialidad } = require("../db/models");

const validarLosHorariosEntreAgendasYPrestadores = async (req, res, next) => {

    const { horarios } = req.body;


    const prestador = await Prestador.findByPk(req.body.prestadorId , {
        include: [{ model: LugarAtencion, include: [{ model: HorarioAtencion }] }]
    });

    const horariosPrestador = prestador.LugarAtencions.find(lugar => lugar.id === req.body.lugaratencionId).HorarioAtencions;

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

const convertirAMinutos = (horario) => {
    const [hora, minutos] = horario.split(":").map(Number);
    return hora * 60 + minutos;
}

const validarLugarDeAtencion = async (req, res, next) => {

    const { prestadorId, lugaratencionId } = req.body;
    const prestador = await Prestador.findByPk(prestadorId, {
        include: [{ model: LugarAtencion }]
    });

    if (prestador.LugarAtencions.filter(lugar => lugar.id === req.body.lugaratencionId).length === 0) {
        return errorPersonalizado(`El lugar de atención con id ${lugaratencionId} no pertenece al prestador con id ${prestadorId}`, 400, next);
    }

    next();
};

const validarEspecialidad = async (req, res, next) => {

    const { prestadorId, especialidadId } = req.body;
    const prestador = await Prestador.findByPk(prestadorId, {
        include: [{ model: Especialidad }]
    });

    if (prestador.Especialidads.filter(especialidad => especialidad.id === especialidadId).length === 0) {
        return errorPersonalizado(`La especialidad con id ${especialidadId} no pertenece al prestador con id ${prestadorId}`, 400, next);
    }

    next();
};

module.exports = {
    validarLosHorariosEntreAgendasYPrestadores,
    validarLugarDeAtencion,
    validarEspecialidad
};