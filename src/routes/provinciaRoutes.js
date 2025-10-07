const { Router } = require('express')
const router = Router()
const { provinciaController } = require('../controllers')


router.post('/', provinciaController.crearProvincia)
router.get('/', provinciaController.obtenerProvincias)

module.exports = router;