const { Router } = require("express");
const router = Router();
const { afiliadoController } = require("../controllers");
const { genericMiddleware, afiliadoMiddleware } = require("../middlewares");
const { afiliadoSchema } = require("../middlewares/schemas");
const { Afiliado } = require("../db/models");

router.post(
  "/",
  /* 
    #swagger.tags = ['Afiliados']
    #swagger.path = '/api/afiliados'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos del Afiliado',
      required: true,
      schema: { $ref: "#/definitions/AfiliadoInput" }
    }
  */
  genericMiddleware.schemaValidator(afiliadoSchema.afiliadoSchemaCreate),
  afiliadoMiddleware.yaExisteNumeroDeDni,
  afiliadoMiddleware.validateVigencia,
  afiliadoController.crearAfiliado
);

router.post(
  "/:id/dependientes",
  /* 
    #swagger.tags = ['Afiliados']
    #swagger.path = '/api/afiliados/{id}/dependientes'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos de los Dependientes del Afiliado',
      required: true,
      schema: { $ref: "#/definitions/AfiliadoDependientesInput" }
    }
  */
  genericMiddleware.existsAnyByModel(Afiliado),
  genericMiddleware.schemaValidator(
    afiliadoSchema.afiliadoSchemaCreateDependiente
  ),
  afiliadoController.agregarDependiente
);

router.get("/",
  /* 
    #swagger.tags = ['Afiliados']
    #swagger.path = '/api/afiliados'
  */
  genericMiddleware.existsAnyByModel(Afiliado),
  afiliadoController.obtenerTitulares
);

router.get("/localidades", 
  /* 
    #swagger.tags = ['Afiliados']
    #swagger.path = '/api/afiliados/localidades'
  */
  afiliadoController.obtenerLocalidadesAfiliados
);

router.get("/provincias", 
  /* 
    #swagger.tags = ['Afiliados']
    #swagger.path = '/api/afiliados/provincias'
  */
  afiliadoController.obtenerProvinciasAfiliados
);

router.get("/:id",
  /* 
    #swagger.tags = ['Afiliados']
    #swagger.path = '/api/afiliados/{id}'
  */
  genericMiddleware.existsAnyByModel(Afiliado),
  afiliadoController.obtenerAfiliado
);

router.get("/:id/reporte", 
  /* 
    #swagger.tags = ['Afiliados']
    #swagger.path = '/api/afiliados/{id}/reporte'
  */
  genericMiddleware.existsAnyByModel(Afiliado),
  afiliadoController.obtenerReporteAfiliado
);

router.delete("/:id",
  /* 
    #swagger.tags = ['Afiliados']
    #swagger.path = '/api/afiliados/{id}'
  */
  genericMiddleware.existsAnyByModel(Afiliado),
  afiliadoController.bajaAfiliado
);

router.put("/:id/datos-personales",
  /* 
    #swagger.tags = ['Afiliados']
    #swagger.path = '/api/afiliados/{id}/datos-personales'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos Personales del Afiliado',
      required: true,
      schema: { $ref: "#/definitions/AfiliadoDatosPersonalesUpdateInput" }
    }
  */
  genericMiddleware.existsAnyByModel(Afiliado),
  genericMiddleware.schemaValidator(afiliadoSchema.afiliadoSchemaUpdateDatosPersonales),
  afiliadoMiddleware.validateDocumentoUnicoEnActualizacion,
  afiliadoController.actualizarDatosPersonalesAfiliado
);

router.put("/:id/plan-medico",
  /* 
    #swagger.tags = ['Afiliados']
    #swagger.path = '/api/afiliados/{id}/plan-medico'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos del Plan Médico del Afiliado',
      required: true,
      schema: { $ref: "#/definitions/AfiliadoPlanMedicoUpdateInput" }
    }
  */
  genericMiddleware.existsAnyByModel(Afiliado),
  genericMiddleware.schemaValidator(afiliadoSchema.afiliadoUpdateSchemaCobertura),
  afiliadoController.actualizarCoberturaAfiliado
);

router.put("/:id/datos-contacto",
  /* 
    #swagger.tags = ['Afiliados']
    #swagger.path = '/api/afiliados/{id}/datos-contacto'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos de Contacto del Afiliado',
      required: true,
      schema: { $ref: "#/definitions/AfiliadoDatosContactoUpdateInput" }
    }
  */
  genericMiddleware.existsAnyByModel(Afiliado),
  genericMiddleware.schemaValidator(afiliadoSchema.afiliadoSchemaUpdateDatosContacto),
  afiliadoController.actualizarDatosContactoAfiliado
);

router.put("/:id/direcciones",
  /* 
    #swagger.tags = ['Afiliados']
    #swagger.path = '/api/afiliados/{id}/direcciones'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos de las Direcciones del Afiliado',
      required: true,
      schema: { $ref: "#/definitions/AfiliadoDireccionesUpdateInput" }
    }
  */
  genericMiddleware.existsAnyByModel(Afiliado),
  genericMiddleware.schemaValidator(afiliadoSchema.afiliadoSchemaUpdateDirecciones),
  afiliadoController.actualizarDireccionesAfiliado
);

module.exports = router;
