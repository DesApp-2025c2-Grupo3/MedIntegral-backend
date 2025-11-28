const { Router } = require("express");
const router = Router();
const { prestadorController } = require("../controllers");
const { genericMiddleware, prestadorMiddleware } = require("../middlewares");
const { Prestador } = require("../db/models");
const { prestadorSchema } = require("../middlewares/schemas");

router.post('/',
  /* 
    #swagger.tags = ['Prestadores']
    #swagger.path = '/api/prestadores'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos del Prestador',
      required: true,
      schema: { $ref: "#/definitions/PrestadorInput" }
    }
  */
  genericMiddleware.schemaValidator(prestadorSchema.prestadorSchemaCreate),
  prestadorMiddleware.noSeRepiteElCuil,
  prestadorMiddleware.validarExistenciaCentroMedico,
  prestadorMiddleware.validarHorarios,
  prestadorController.crearPrestador
);

router.get('/',
  /* 
    #swagger.tags = ['Prestadores']
    #swagger.path = '/api/prestadores'
  */
  genericMiddleware.existsAnyByModel(Prestador),
  prestadorController.obtenerPrestadores
);

router.get('/listado',
  /* 
    #swagger.tags = ['Prestadores']
    #swagger.path = '/api/prestadores/listado'
  */
  genericMiddleware.existsAnyByModel(Prestador),
  prestadorController.obtenerPrestadoresFormateados
);

router.get('/localidades',
  /* 
    #swagger.tags = ['Prestadores']
    #swagger.path = '/api/prestadores/localidades'
  */
  genericMiddleware.existsAnyByModel(Prestador),
  prestadorController.obtenerLocalidadesPrestadores
);

router.get('/centros-medicos',
  /* 
    #swagger.tags = ['Prestadores']
    #swagger.path = '/api/prestadores/centros-medicos'
  */
  genericMiddleware.existsAnyByModel(Prestador),
  prestadorMiddleware.existeAlgunCentroMedico,
  prestadorController.obtenerCentrosMedicos
);

router.get("/provincias",
  /* 
    #swagger.tags = ['Prestadores']
    #swagger.path = '/api/prestadores/provincias'
  */
  prestadorController.obtenerProvinciasPrestadores
);

router.get("/:id",
  /* 
    #swagger.tags = ['Prestadores']
    #swagger.path = '/api/prestadores/{id}'
  */
  genericMiddleware.existsModelById(Prestador),
  prestadorController.obtenerPrestador
);

router.put("/:id/datos-personales",
  /* 
    #swagger.tags = ['Prestadores']
    #swagger.path = '/api/prestadores/{id}/datos-personales'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos Personales del Prestador',
      required: true,
      schema: { $ref: "#/definitions/PrestadorDatosPersonalesUpdateInput" }
    }
  */
  genericMiddleware.existsModelById(Prestador),
  genericMiddleware.schemaValidator(prestadorSchema.prestadorSchemaUpdateDatosPersonales),
  prestadorController.actualizarDatosPersonalesPrestador
);

router.put("/:id/lugares-atencion",
  /* 
    #swagger.tags = ['Prestadores']
    #swagger.path = '/api/prestadores/{id}/lugares-atencion'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Lugares de Atencion del Prestador',
      required: true,
      schema: { $ref: "#/definitions/PrestadorLugaresAtencionUpdateInput" }
    }
  */
  genericMiddleware.existsModelById(Prestador),
  genericMiddleware.schemaValidator(prestadorSchema.prestadorSchemaUpdateLugaresAtencion),
  prestadorController.actualizarLugaresAtencionPrestador
);

router.put("/:id/especialidades",
  /* 
    #swagger.tags = ['Prestadores']
    #swagger.path = '/api/prestadores/{id}/especialidades'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Especialidades del Prestador',
      required: true,
      schema: { $ref: "#/definitions/PrestadorEspecialidadesUpdateInput" }
    }
  */
  genericMiddleware.existsModelById(Prestador),
  genericMiddleware.schemaValidator(prestadorSchema.prestadorSchemaUpdateEspecialidades),
  prestadorController.actualizarEspecialidadesPrestador
);

router.put("/:id/centro-medico",
  /* 
    #swagger.tags = ['Prestadores']
    #swagger.path = '/api/prestadores/{id}/centro-medico'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos del Prestador relacionados a Centro Medico',
      required: true,
      schema: { $ref: "#/definitions/PrestadorCentroMedicoUpdateInput" }
    }
  */
  genericMiddleware.existsModelById(Prestador),
  genericMiddleware.schemaValidator(prestadorSchema.prestadorSchemaUpdateCentroMedico),
  prestadorController.actualizarCentroMedicoPrestador
);

router.delete("/:id",
  /* 
    #swagger.tags = ['Prestadores']
    #swagger.path = '/api/prestadores/{id}'
  */
  genericMiddleware.existsModelById(Prestador),
  prestadorMiddleware.validarQueNoSeaCentroMedicoONoTengaIntegrantes,
  prestadorController.eliminarPrestador
);

module.exports = router;
