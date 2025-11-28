const { Router } = require('express');
const router = Router();
const { tipoDocumentoController } = require('../controllers');

router.get('/',
    /* 
    #swagger.tags = ['Tipos de Documentos']
    #swagger.path = '/api/tipo-documentos'
    */
    tipoDocumentoController.obtenerTiposDocumentos
);

module.exports = router;