const { Router } = require('express');
const router = Router();
const { planMedicoController } = require('../controllers');

router.get('/', 
    planMedicoController.obtenerPlanesMedicos
);

module.exports = router;