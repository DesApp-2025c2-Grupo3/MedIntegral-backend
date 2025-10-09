const { Router } = require('express')
const router = Router()
const { direccionController } = require('../controllers')

router.post('/', direccionController.crearDireccion)
router.get('/', direccionController.obtenerDirecciones)
router.put('/:id', direccionController.actualizarDireccion)
router.delete('/:id', direccionController.eliminarDireccion)

module.exports = router