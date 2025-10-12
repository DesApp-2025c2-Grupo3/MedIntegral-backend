const { Router } = require('express')
const router = Router()
const { agendaTurnosController } = require('../controllers')
const { genericMiddleware } = require('../middlewares')
const { AgendaTurnos } = require("../db/models");
const { agendaTurnosSchema } = require("../middlewares/schemas");


router.post('/',
    genericMiddleware.schemaValidator(agendaTurnosSchema.agendaTurnosSchemaCreate),
    agendaTurnosController.crearAgendaTurnos
);
// router.get('/',
//     genericMiddleware.existsAnyByModel(AgendaTurnos),
//     agendaTurnosController.obtenerAgendasTurnos
// )

module.exports = router;