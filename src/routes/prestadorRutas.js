const { Router } = require("express");
const router = Router();
const { prestadorController } = require("../controllers");
const { genericMiddleware, prestadorMiddleware } = require("../middlewares");
const { Prestador } = require("../db/models");
const { prestadorSchema } = require("../middlewares/schemas");

router.post('/', 
    genericMiddleware.schemaValidator(prestadorSchema.prestadorSchemaCreate),
    prestadorMiddleware.validarExistenciaCentroMedico,
    prestadorController.crearPrestador
);

router.get('/', 
    genericMiddleware.existsAnyByModel(Prestador),
    prestadorController.obtenerPrestadores
);

router.get("/:id", 
  genericMiddleware.existsModelById(Prestador),
  prestadorController.obtenerPrestador);

router.put("/:id/datos-personales",
//   genericMiddleware.schemaValidator(prestadorSchema.prestadorSchemaUpdate),
  prestadorController.actualizarDatosPersonalesPrestador
);

router.put(
  "/:id/lugares-atencion",
//   genericMiddleware.schemaValidator(prestadorSchema.prestadorSchemaUpdate),
  prestadorController.actualizarLugaresAtencionPrestador
);

router.put(
  "/:id/especialidades",
  //   genericMiddleware.schemaValidator(prestadorSchema.prestadorSchemaUpdate),
  prestadorController.actualizarEspecialidadesPrestador
);

router.put(
  "/:id/centro-medico",
  //   genericMiddleware.schemaValidator(prestadorSchema.prestadorSchemaUpdate),
  prestadorController.actualizarCentroMedicoPrestador
);

module.exports = router;
