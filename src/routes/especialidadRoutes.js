const { Router } = require('express');
const router = Router();
const { especialidadController } = require('../controllers');
const { genericMiddleware } = require('../middlewares');
const { Especialidad } = require("../db/models");

router.get('/', 
    /* 
    #swagger.tags = ['Especialidades']
    #swagger.path = '/api/especialidades'
    */
    genericMiddleware.existsAnyByModel(Especialidad),
    especialidadController.obtenerEspecialidades
);

module.exports = router;