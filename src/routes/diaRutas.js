const { Router } = require('express')
const router = Router()
const { diaController } = require('../controllers')

router.get('/', diaController.obtenerDias)

module.exports = router;