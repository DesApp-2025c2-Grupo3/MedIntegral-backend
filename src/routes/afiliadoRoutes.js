const { Router } = require("express");
const router = Router();
const { afiliadoController } = require("../controllers");

router.post('/',
  afiliadoController.crearAfiliado
);
router.get('/',
  afiliadoController.obtenerTitulares
);

module.exports = router;