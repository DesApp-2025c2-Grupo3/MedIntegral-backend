const { Router } = require('express')
const {telefonoController} = require('../controllers')
const { genericMiddleware, telefonoMiddleware } = require('../middlewares')
const { Telefono } = require("../db/models");
const { telefonoSchema }  = require("../middlewares/schemas");
const router = Router()

router.post('/', 
    genericMiddleware.schemaValidator(telefonoSchema.telefonoSchemaCreate),
    genericMiddleware.validarCamposExactos(Telefono), 
    telefonoController.crearTelefono)

router.get('/', 
    genericMiddleware.existsAnyByModel(Telefono),
    telefonoController.obtenerTelefonos)

module.exports = router;