const { Router } = require('express');
const router = Router();
const { provinciaController } = require('../controllers');
const { genericMiddleware } = require('../middlewares');
const { Provincia } = require("../db/models");

router.get('/', 
    genericMiddleware.existsAnyByModel(Provincia),
    provinciaController.obtenerProvincias
);

module.exports = router;