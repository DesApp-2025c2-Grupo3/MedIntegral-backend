const { Router } = require('express');
const router = Router();
const { situacionTerapeuticaController } = require('../controllers');

router.get('/', 
    situacionTerapeuticaController.obtenerSituacionesTerapeuticas
);

module.exports = router;