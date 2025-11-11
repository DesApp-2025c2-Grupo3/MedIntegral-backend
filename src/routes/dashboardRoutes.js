const { Router } = require('express')
const router = Router()
const { dashboardControllers } = require('../controllers')

router.get('/afiliados-totales', dashboardControllers.obtenerAfiliadosTotales);

router.get('/prestadores-totales', dashboardControllers.obtenerPrestadoresTotales);

router.get('/agendas-totales', dashboardControllers.obtenerAgendasTotales);

router.get('/cantidad-especialidades', dashboardControllers.obtenerCantidadEspecialidades);

router.get('prestadores-por-localidad', dashboardControllers.obtenerPrestadoresPorLocalidad);

router.get('/prestadores-por-especalidad', dashboardControllers.obtenerPrestadoresPorEspecialidad);

router.get('/afiliados-con-baja', dashboardControllers.obtenerAfiliadosConBaja);

router.get('/prestadores-sin-agenda', dashboardControllers.obtenerPrestadoresSinAgenda);

router.get('/planes-medicos-por-mes', dashboardControllers.obtenerPlanesMedicosPorMes);

module.exports = router;