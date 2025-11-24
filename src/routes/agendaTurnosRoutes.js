const { Router } = require('express');
const router = Router();
const { agendaTurnosController } = require('../controllers');
const { genericMiddleware, agendaTurnosMiddleware } = require('../middlewares');
const { AgendaTurnos, Especialidad, Prestador, LugarAtencion } = require("../db/models");
const { agendaTurnosSchema } = require("../middlewares/schemas");

router.post('/',
    genericMiddleware.schemaValidator(agendaTurnosSchema.agendaTurnosSchemaCreate),
    genericMiddleware.existModelRequest(Prestador),
    genericMiddleware.existModelRequest(Especialidad),
    genericMiddleware.existModelRequest(LugarAtencion),
    agendaTurnosMiddleware.validarHorarios,
    agendaTurnosMiddleware.validarQueElLugarTengaRelacionConElPrestador,
    agendaTurnosMiddleware.validarQueLaEspecialidadTengaRelacionConElPrestador,
    //agendaTurnosMiddleware.validarLosHorariosEntreAgendasYPrestadores,
    agendaTurnosMiddleware.validarQueNoExistaUnaAgendaConElMismoPrestadorMismoLugarYMismaEspecialidad,
    agendaTurnosController.crearAgendaTurnos
);

router.get('/',
    genericMiddleware.existsAnyByModel(AgendaTurnos),
    agendaTurnosController.obtenerAgendasTurnos
);

router.get('/prestador/:prestadorId',
    agendaTurnosMiddleware.validarQueExistaElPrestador,
    agendaTurnosController.obtenerPrestador
);

router.get('/localidades', 
    agendaTurnosController.obtenerLocalidadesAgendas
);

router.get('/provincias', 
    agendaTurnosController.obtenerProvinciasAgendas
);

router.get('/listado',
    genericMiddleware.existsAnyByModel(AgendaTurnos),
    agendaTurnosController.obtenerAgendasTurnosFormateados
);

router.get("/prestadores-con-agenda-incompleta",
    genericMiddleware.existsAnyByModel(Prestador),
    agendaTurnosController.obtenerPrestadoresConAgendaIncompleta
);

router.get("/:id",
    genericMiddleware.existsModelById(AgendaTurnos),
    agendaTurnosController.obtenerUnaAgendaTurnos
);

router.put("/:id/horarios",
    genericMiddleware.existsModelById(AgendaTurnos),
    genericMiddleware.schemaValidator(agendaTurnosSchema.agendaTurnosSchemaUpdateHorarios),
    agendaTurnosMiddleware.validarHorarios,
    //agendaTurnosMiddleware.validarLosHorariosEntreAgendasYPrestadores,
    agendaTurnosController.actualizarHorariosDeAgendaTurnos
);

router.put("/:id/especialidades",
    genericMiddleware.existsModelById(AgendaTurnos),
    genericMiddleware.schemaValidator(agendaTurnosSchema.agendaTurnosSchemaUpdateEspecialidad),
    genericMiddleware.existModelRequest(Especialidad),
    agendaTurnosMiddleware.validarQueLaEspecialidadTengaRelacionConElPrestador,
    agendaTurnosMiddleware.validarQueNoExistaUnaAgendaConElMismoPrestadorMismoLugarYMismaEspecialidad,
    agendaTurnosController.actualizarEspecialidadDeAgendaTurnos
);

router.delete("/:id",
    genericMiddleware.existsModelById(AgendaTurnos),
    agendaTurnosController.eliminarAgendaTurnos
);

module.exports = router;