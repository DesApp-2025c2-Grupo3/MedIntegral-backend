const { Router } = require('express')
const {telefonoController} = require('../controllers')
const { telefonoMiddleware } = require('../middlewares')
const router = Router()

router.post('/', telefonoMiddleware, telefonoController.crearTelefono)
router.get('/', telefonoController.obtenerTelefonos)
router.put('/:id', telefonoController.actualizarTelefono)
router.delete('/:id', telefonoController.eliminarTelefono)

module.exports = router;