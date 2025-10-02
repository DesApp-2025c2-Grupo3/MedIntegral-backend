const { Router } = require('express')
const {telefonoController} = require('../controllers')
const { telefonoMiddleware } = require('../middlewares')
const router = Router()

router.post('/', telefonoMiddleware, telefonoController.crearTelefono)
router.get('/', telefonoController.obtenerTelefonos)

module.exports = router;