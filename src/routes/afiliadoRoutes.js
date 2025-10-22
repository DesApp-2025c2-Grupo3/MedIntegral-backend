const { Router } = require("express");
const router = Router();
const { afiliadoController } = require("../controllers");

router.post('/',
  afiliadoController.crearAfiliado
);

module.exports = router;