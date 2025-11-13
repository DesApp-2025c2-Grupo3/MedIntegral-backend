const { Router } = require("express");
const router = Router();
const { afiliadoController } = require("../controllers");
const { genericMiddleware, afiliadoMiddleware } = require("../middlewares");
const { afiliadoSchema } = require("../middlewares/schemas");
const { Afiliado } = require("../db/models");

router.post(
  "/",
  genericMiddleware.schemaValidator(afiliadoSchema.afiliadoSchemaCreate),
  afiliadoMiddleware.yaExisteNumeroDeDni,
  afiliadoController.crearAfiliado
);

router.post(
  "/:id/dependientes",
  // genericMiddleware.schemaValidator(afiliadoSchema.afiliadoSchemaCreateDependiente), //TODO: crear schema para dependiente
  afiliadoController.agregarDependiente
);

router.get(
  "/",
  genericMiddleware.existsAnyByModel(Afiliado),
  afiliadoController.obtenerTitulares
);

router.get(
  "/:id",
  genericMiddleware.existsAnyByModel(Afiliado),
  afiliadoController.obtenerAfiliado
);

router.delete(
  "/:id",
  genericMiddleware.existsAnyByModel(Afiliado),
  afiliadoController.bajaAfiliado
);

router.put(
  "/:id/datos-personales",
  //Agregar middlewares si es necesario: TODO
  afiliadoController.actualizarDatosPersonalesAfiliado
);

router.put(
  "/:id/plan-medico",
  //Agregar middlewares si es necesario: TODO
  afiliadoController.actualizarCoberturaAfiliado
);

router.put(
  "/:id/situaciones-terapeuticas",
  //Agregar middlewares si es necesario: TODO
  afiliadoController.actualizarSituacionesTerapeuticasAfiliado
);

router.put(
  "/:id/datos-contacto",
  //Agregar middlewares si es necesario: TODO
  afiliadoController.actualizarDatosContactoAfiliado
);

router.put(
  "/:id/direcciones",
  //Agregar middlewares si es necesario: TODO
  afiliadoController.actualizarDireccionesAfiliado
);

module.exports = router;
