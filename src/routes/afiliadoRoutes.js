const { Router } = require("express");
const router = Router();
const { afiliadoController } = require("../controllers");
const { genericMiddleware, afiliadoMiddleware } = require("../middlewares");
const { afiliadoSchema } = require("../middlewares/schemas");
const { Afiliado } = require("../db/models");
const { existsAnyByModel } = require("../middlewares/genericMiddleware");

router.post(
  "/",
  genericMiddleware.schemaValidator(afiliadoSchema.afiliadoSchemaCreate),
  afiliadoMiddleware.yaExisteNumeroDeDni,
  afiliadoMiddleware.validateVigencia,
  afiliadoController.crearAfiliado
);

router.post(
  "/:id/dependientes",
  genericMiddleware.existsAnyByModel(Afiliado),
  genericMiddleware.schemaValidator(
    afiliadoSchema.afiliadoSchemaCreateDependiente
  ),
  afiliadoController.agregarDependiente
);

router.get(
  "/",
  genericMiddleware.existsAnyByModel(Afiliado),
  afiliadoController.obtenerTitulares
);

router.get("/localidades", afiliadoController.obtenerLocalidadesAfiliados);

router.get("/provincias", afiliadoController.obtenerProvinciasAfiliados);

router.get(
  "/:id",
  genericMiddleware.existsAnyByModel(Afiliado),
  afiliadoController.obtenerAfiliado
);

router.get("/:id/reporte", 
  genericMiddleware.existsAnyByModel(Afiliado),
  afiliadoController.obtenerReporteAfiliado
);

router.delete(
  "/:id",
  genericMiddleware.existsAnyByModel(Afiliado),
  afiliadoController.bajaAfiliado
);

router.put(
  "/:id/datos-personales",
  genericMiddleware.existsAnyByModel(Afiliado),
  genericMiddleware.schemaValidator(
    afiliadoSchema.afiliadoSchemaUpdateDatosPersonales
  ),
  afiliadoMiddleware.validateDocumentoUnicoEnActualizacion,
  afiliadoController.actualizarDatosPersonalesAfiliado
);

router.put(
  "/:id/plan-medico",
  genericMiddleware.existsAnyByModel(Afiliado),
  genericMiddleware.schemaValidator(
    afiliadoSchema.afiliadoUpdateSchemaCobertura
  ),
  afiliadoController.actualizarCoberturaAfiliado
);

router.put(
  "/:id/datos-contacto",
  genericMiddleware.existsAnyByModel(Afiliado),
  genericMiddleware.schemaValidator(
    afiliadoSchema.afiliadoSchemaUpdateDatosContacto
  ),
  afiliadoController.actualizarDatosContactoAfiliado
);

router.put(
  "/:id/direcciones",
  genericMiddleware.existsAnyByModel(Afiliado),
  genericMiddleware.schemaValidator(
    afiliadoSchema.afiliadoSchemaUpdateDirecciones
  ),
  afiliadoController.actualizarDireccionesAfiliado
);

module.exports = router;
