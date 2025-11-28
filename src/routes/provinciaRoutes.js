const { Router } = require('express');
const router = Router();
const { provinciaController } = require('../controllers');
const { genericMiddleware } = require('../middlewares');
const { Provincia } = require("../db/models");

router.get('/',
    /* 
    #swagger.tags = ['Provincias']
    #swagger.path = '/api/provincias'
    */ 
    genericMiddleware.existsAnyByModel(Provincia),
    provinciaController.obtenerProvincias
);

module.exports = router;