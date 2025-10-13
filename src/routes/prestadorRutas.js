const { Router } = require("express");
const router = Router();
const { prestadorController } = require("../controllers");
const { genericMiddleware } = require("../middlewares");
const { Prestador } = require("../db/models");
const { prestadorSchema } = require("../middlewares/schemas");

router.post('/', 
    genericMiddleware.schemaValidator(prestadorSchema.prestadorSchemaCreate),
    prestadorController.crearPrestador
);
router.get('/', 
    genericMiddleware.existsAnyByModel(Prestador),
    prestadorController.obtenerPrestadores
);

router.get("/:id", 
  prestadorController.obtenerPrestador);

router.put("/:id/datos-personales",
//   genericMiddleware.schemaValidator(prestadorSchema.prestadorSchemaUpdate),
  prestadorController.actualizarDatosPersonalesPrestador
);

module.exports = router;
