const { Router } = require('express');
const router = Router();
const { parentescoController } = require('../controllers');

router.get('/', 
    parentescoController.obtenerParentescos
);

module.exports = router;