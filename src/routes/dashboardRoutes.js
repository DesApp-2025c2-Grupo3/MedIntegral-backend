const { Router } = require('express');
const router = Router();
const { Afiliado, Prestador, AgendasTurnos } = require('../db/models');
const { genericMiddleware } = require('../middlewares');
const { dashboardController } = require('../controllers');

router.get('/afiliados-totales', dashboardController.obtenerAfiliadosTotales);

router.get('/prestadores-totales', dashboardController.obtenerPrestadoresTotales);

router.get('/agendas-totales', dashboardController.obtenerAgendasTotales);

router.get('/cantidad-especialidades', dashboardController.obtenerCantidadEspecialidades);

router.get('/prestadores-por-localidad', genericMiddleware.existsAnyByModel(Prestador), dashboardController.obtenerPrestadoresPorLocalidad);

router.get('/prestadores-por-especialidad', genericMiddleware.existsAnyByModel(Prestador), dashboardController.obtenerPrestadoresPorEspecialidad);

router.get('/afiliados-con-baja', genericMiddleware.existsAnyByModel(Afiliado), dashboardController.obtenerAfiliadosConBaja);

router.get('/prestadores-sin-agenda', 
    genericMiddleware.existsAnyByModel(Prestador),
    genericMiddleware.existsAnyByModel(AgendasTurnos),
    dashboardController.obtenerPrestadoresSinAgenda
);

router.get('/planes-medicos-por-mes', genericMiddleware.existsAnyByModel(Afiliado), dashboardController.obtenerPlanesMedicosPorMes);

module.exports = router;