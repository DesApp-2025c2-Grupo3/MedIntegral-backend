const { Router } = require('express')
const router = Router()
const { prestadorController } = require('../controllers')
const { genericMiddleware } = require('../middlewares')
const { Prestador } = require("../db/models");
const { prestadorSchema }  = require("../middlewares/schemas");


router.post('/', 
    genericMiddleware.schemaValidator(prestadorSchema.prestadorSchemaCreate),
    prestadorController.crearPrestador);
//router.get('/', prestadorController.obtenerPrestadores)

module.exports = router;