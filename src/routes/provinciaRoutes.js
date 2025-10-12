const { Router } = require('express')
const router = Router()
const { provinciaController } = require('../controllers')

router.get('/', provinciaController.obtenerProvincias)

module.exports = router;