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
    agendaTurnosMiddleware.validarLugarDeAtencion,
    agendaTurnosMiddleware.validarEspecialidad,
    agendaTurnosMiddleware.validarLosHorariosEntreAgendasYPrestadores,
    agendaTurnosController.crearAgendaTurnos
);

router.get('/',
    genericMiddleware.existsAnyByModel(AgendaTurnos),
    agendaTurnosController.obtenerAgendasTurnos
);

router.get('/listado',
    genericMiddleware.existsAnyByModel(AgendaTurnos),
    agendaTurnosController.obtenerAgendasTurnosFormateados
);

router.get("/:id",
    genericMiddleware.existsModelById(AgendaTurnos),
    agendaTurnosController.obtenerUnaAgendaTurnos
);

router.put("/:id/horarios",
    genericMiddleware.existsModelById(AgendaTurnos),
    genericMiddleware.schemaValidator(agendaTurnosSchema.agendaTurnosSchemaUpdateHorarios),
    agendaTurnosController.actualizarHorariosDeAgendaTurnos
);

router.put("/:id/especialidades",
    genericMiddleware.existsModelById(AgendaTurnos),
    genericMiddleware.schemaValidator(agendaTurnosSchema.agendaTurnosSchemaUpdateEspecialidad),
    genericMiddleware.existModelRequest(Especialidad),
    agendaTurnosController.actualizarEspecialidadDeAgendaTurnos
);

router.delete("/:id",
    genericMiddleware.existsModelById(AgendaTurnos),
    agendaTurnosController.eliminarAgendaTurnos
);

module.exports = router;