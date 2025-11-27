const { Router } = require('express');
const router = Router();
const { Afiliado, Prestador, AgendaTurnos } = require('../db/models');
const { genericMiddleware } = require('../middlewares');
const { dashboardController } = require('../controllers');

router.get('/afiliados-totales',
    /* 
    #swagger.tags = ['Dashboard']
    #swagger.path = '/api/dashboard/afiliados-totales'
    */
    dashboardController.obtenerAfiliadosTotales
);

router.get('/prestadores-totales',
    /* 
    #swagger.tags = ['Dashboard']
    #swagger.path = '/api/dashboard/prestadores-totales'
    */
    dashboardController.obtenerPrestadoresTotales
);

router.get('/agendas-totales',
    /* 
    #swagger.tags = ['Dashboard']
    #swagger.path = '/api/dashboard/agendas-totales'
    */
    dashboardController.obtenerAgendasTotales
);

router.get('/cantidad-especialidades',
    /* 
    #swagger.tags = ['Dashboard']
    #swagger.path = '/api/dashboard/cantidad-especialidades'
    */
    dashboardController.obtenerCantidadEspecialidades
);

router.get('/prestadores-por-localidad',
    /* 
    #swagger.tags = ['Dashboard']
    #swagger.path = '/api/dashboard/prestadores-por-localidad'
    */
    genericMiddleware.existsAnyByModel(Prestador),
    dashboardController.obtenerPrestadoresPorLocalidad
);

router.get('/prestadores-por-especialidad',
    /* 
    #swagger.tags = ['Dashboard']
    #swagger.path = '/api/dashboard/prestadores-por-especialidad'
    */
    genericMiddleware.existsAnyByModel(Prestador),
    dashboardController.obtenerPrestadoresPorEspecialidad
);

router.get('/afiliados-con-baja',
    /* 
    #swagger.tags = ['Dashboard']
    #swagger.path = '/api/dashboard/afiliados-con-baja'
    */
    genericMiddleware.existsAnyByModel(Afiliado),
    dashboardController.obtenerAfiliadosConBaja
);

router.get("/prestadores-sin-agenda",
    /* 
    #swagger.tags = ['Dashboard']
    #swagger.path = '/api/dashboard/prestadores-sin-agenda'
    */
    genericMiddleware.existsAnyByModel(Prestador),
    genericMiddleware.existsAnyByModel(AgendaTurnos),
    dashboardController.obtenerPrestadoresSinAgenda
);

router.get('/planes-medicos-por-mes',
    /* 
    #swagger.tags = ['Dashboard']
    #swagger.path = '/api/dashboard/planes-medicos-por-mes'
    */
    genericMiddleware.existsAnyByModel(Afiliado),
    dashboardController.obtenerPlanesMedicosPorMes
);

module.exports = router;