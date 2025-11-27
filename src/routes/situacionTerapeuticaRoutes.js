const { Router } = require('express');
const router = Router();
const { situacionTerapeuticaController } = require('../controllers');

router.get('/', 
    /* 
    #swagger.tags = ['Situaciones Terapeuticas']
    #swagger.path = '/api/situaciones-terapeuticas'
    */
    situacionTerapeuticaController.obtenerSituacionesTerapeuticas
);

module.exports = router;