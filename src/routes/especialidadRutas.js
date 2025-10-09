const { Router } = require('express')
const router = Router()
const { especialidadController } = require('../controllers')

router.post('/', especialidadController.crearEspecialidad)
router.get('/', especialidadController.obtenerEspecialidades)

module.exports = router