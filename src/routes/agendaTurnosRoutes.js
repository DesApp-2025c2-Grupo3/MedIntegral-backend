const { Router } = require('express')
const router = Router()
const { agendaTurnosController } = require('../controllers')
const { genericMiddleware } = require('../middlewares')
const { AgendaTurnos, Especialidad, Prestador, LugarAtencion } = require("../db/models");
const { agendaTurnosSchema } = require("../middlewares/schemas");


router.post('/',
    genericMiddleware.schemaValidator(agendaTurnosSchema.agendaTurnosSchemaCreate),
    genericMiddleware.existModelRequest(Prestador),
    genericMiddleware.existModelRequest(Especialidad),
    genericMiddleware.existModelRequest(LugarAtencion),
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

module.exports = router;