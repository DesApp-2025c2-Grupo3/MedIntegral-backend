const { Router } = require('express');
const router = Router();
const { tipoDocumentoController } = require('../controllers');

router.get('/', 
    tipoDocumentoController.obtenerTiposDocumentos
);

module.exports = router;