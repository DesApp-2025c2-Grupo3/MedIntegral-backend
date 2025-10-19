const { Router } = require('express');
const router = Router();
const { especialidadController } = require('../controllers');
const { genericMiddleware } = require('../middlewares');
const { Especialidad } = require("../db/models");

router.get('/', 
    genericMiddleware.existsAnyByModel(Especialidad),
    especialidadController.obtenerEspecialidades
);

module.exports = router;