const { Router } = require('express');
const router = Router();
const { parentescoController } = require('../controllers');

router.get('/', 
    /* 
    #swagger.tags = ['Parentescos']
    #swagger.path = '/api/parentescos'
    */
    parentescoController.obtenerParentescos
);

module.exports = router;