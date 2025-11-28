const { Router } = require('express');
const router = Router();
const { planMedicoController } = require('../controllers');

router.get('/', 
    /* 
    #swagger.tags = ['Planes Medicos']
    #swagger.path = '/api/planes-medicos'
    */
    planMedicoController.obtenerPlanesMedicos
);

module.exports = router;