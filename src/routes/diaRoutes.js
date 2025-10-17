const { Router } = require('express')
const router = Router()
const { diaController } = require('../controllers')
const { genericMiddleware } = require('../middlewares')
const { Dia } = require("../db/models");

router.get('/', 
    genericMiddleware.existsAnyByModel(Dia),
    diaController.obtenerDias)

module.exports = router;