const { Router } = require('express')
const router = Router()
const { especialidadController } = require('../controllers')

router.get('/', especialidadController.obtenerEspecialidades)

module.exports = router;