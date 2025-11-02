const { Router } = require("express");
const router = Router();
const { prestadorController, provinciaController } = require("../controllers");
const { genericMiddleware, prestadorMiddleware } = require("../middlewares");
const { Prestador, AgendaTurnos } = require("../db/models");
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

router.get('/listado', 
  genericMiddleware.existsAnyByModel(Prestador),
  prestadorController.obtenerPrestadoresFormateados
);

router.get('/localidades', prestadorController.obtenerLocalidadesPrestadores);
router.get('/provincias', provinciaController.obtenerProvincias)

router.get("/sin-agenda",
  genericMiddleware.existsAnyByModel(Prestador),
  genericMiddleware.existsAnyByModel(AgendaTurnos),
  prestadorController.obtenerPrestadoresSinAgenda
);

router.get("/:id",
  genericMiddleware.existsModelById(Prestador),
  prestadorController.obtenerPrestador
);

router.put("/:id/datos-personales",
  genericMiddleware.existsModelById(Prestador),
  genericMiddleware.schemaValidator(prestadorSchema.prestadorSchemaUpdateDatosPersonales),
  prestadorController.actualizarDatosPersonalesPrestador
);

router.put("/:id/lugares-atencion",
  genericMiddleware.existsModelById(Prestador),
  genericMiddleware.schemaValidator(prestadorSchema.prestadorSchemaUpdateLugaresAtencion),
  prestadorController.actualizarLugaresAtencionPrestador
);

router.put("/:id/especialidades",
  genericMiddleware.existsModelById(Prestador),
  genericMiddleware.schemaValidator(prestadorSchema.prestadorSchemaUpdateEspecialidades),
  prestadorController.actualizarEspecialidadesPrestador
);

router.put("/:id/centro-medico",
  genericMiddleware.existsModelById(Prestador),
  genericMiddleware.schemaValidator(prestadorSchema.prestadorSchemaUpdateCentroMedico),
  prestadorController.actualizarCentroMedicoPrestador
);

router.delete("/:id",
    genericMiddleware.existsModelById(Prestador),
    prestadorMiddleware.validarQueNoSeaCentroMedicoONoTengaIntegrantes,
    prestadorController.eliminarPrestador
);

module.exports = router;
