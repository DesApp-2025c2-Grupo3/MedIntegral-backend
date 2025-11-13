const { Router } = require('express');
const router = Router();
const { dashboardController } = require('../controllers');

router.get('/afiliados-totales', dashboardController.obtenerAfiliadosTotales);

router.get('/prestadores-totales', dashboardController.obtenerPrestadoresTotales);

router.get('/agendas-totales', dashboardController.obtenerAgendasTotales);

router.get('/cantidad-especialidades', dashboardController.obtenerCantidadEspecialidades);

router.get('/prestadores-por-localidad', dashboardController.obtenerPrestadoresPorLocalidad);

router.get('/prestadores-por-especialidad', dashboardController.obtenerPrestadoresPorEspecialidad);

router.get('/afiliados-con-baja', dashboardController.obtenerAfiliadosConBaja);

router.get('/prestadores-sin-agenda', dashboardController.obtenerPrestadoresSinAgenda);

router.get('/planes-medicos-por-mes', dashboardController.obtenerPlanesMedicosPorMes);

module.exports = router;