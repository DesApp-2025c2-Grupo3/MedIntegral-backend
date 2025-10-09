const { Router } = require('express')
const router = Router()
const { diaController } = require('../controllers')

router.post('/', diaController.crearDia)
router.get('/', diaController.obtenerDias)

module.exports = router;