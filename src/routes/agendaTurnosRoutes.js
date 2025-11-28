const { Router } = require('express');
const router = Router();
const { agendaTurnosController } = require('../controllers');
const { genericMiddleware, agendaTurnosMiddleware } = require('../middlewares');
const { AgendaTurnos, Especialidad, Prestador, LugarAtencion } = require("../db/models");
const { agendaTurnosSchema } = require("../middlewares/schemas");

router.post('/',
    /* 
    #swagger.tags = ['Agendas de Turnos']
    #swagger.path = '/api/agenda-turnos'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos de la Agenda de Turnos',
      required: true,
      schema: { $ref: "#/definitions/AgendaDeTurnosInput" }
    }
    */
    genericMiddleware.schemaValidator(agendaTurnosSchema.agendaTurnosSchemaCreate),
    genericMiddleware.existModelRequest(Prestador),
    genericMiddleware.existModelRequest(Especialidad),
    genericMiddleware.existModelRequest(LugarAtencion),
    agendaTurnosMiddleware.validarHorarios,
    agendaTurnosMiddleware.validarQueElLugarTengaRelacionConElPrestador,
    agendaTurnosMiddleware.validarQueLaEspecialidadTengaRelacionConElPrestador,
    //agendaTurnosMiddleware.validarLosHorariosEntreAgendasYPrestadores,
    agendaTurnosMiddleware.validarQueNoExistaUnaAgendaConElMismoPrestadorMismoLugarYMismaEspecialidad,
    agendaTurnosController.crearAgendaTurnos
);

router.get('/',
    /* 
    #swagger.tags = ['Agendas de Turnos']
    #swagger.path = '/api/agenda-turnos'
    */
    genericMiddleware.existsAnyByModel(AgendaTurnos),
    agendaTurnosController.obtenerAgendasTurnos
);

router.get('/prestador/:prestadorId',
    /* 
    #swagger.tags = ['Agendas de Turnos']
    #swagger.path = '/api/agenda-turnos/prestador/{prestadorId}'
    */
    agendaTurnosMiddleware.validarQueExistaElPrestador,
    agendaTurnosController.obtenerPrestador
);

router.get('/localidades',
    /* 
    #swagger.tags = ['Agendas de Turnos']
    #swagger.path = '/api/agenda-turnos/localidades'
    */
    agendaTurnosController.obtenerLocalidadesAgendas
);

router.get('/provincias',
    /* 
    #swagger.tags = ['Agendas de Turnos']
    #swagger.path = '/api/agenda-turnos/provincias'
    */
    agendaTurnosController.obtenerProvinciasAgendas
);

router.get('/listado',
    /* 
    #swagger.tags = ['Agendas de Turnos']
    #swagger.path = '/api/agenda-turnos/listado'
    */
    genericMiddleware.existsAnyByModel(AgendaTurnos),
    agendaTurnosController.obtenerAgendasTurnosFormateados
);

router.get("/prestadores-con-agenda-incompleta",
    /* 
    #swagger.tags = ['Agendas de Turnos']
    #swagger.path = '/api/agenda-turnos/prestadores-con-agenda-incompleta'
    */
    genericMiddleware.existsAnyByModel(Prestador),
    agendaTurnosController.obtenerPrestadoresConAgendaIncompleta
);

router.get("/:id",
    /* 
    #swagger.tags = ['Agendas de Turnos']
    #swagger.path = '/api/agenda-turnos/{id}'
    */
    genericMiddleware.existsModelById(AgendaTurnos),
    agendaTurnosController.obtenerUnaAgendaTurnos
);

router.put("/:id/horarios",
    /* 
    #swagger.tags = ['Agendas de Turnos']
    #swagger.path = '/api/agenda-turnos/{id}/horarios'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Horarios de la Agenda de Turnos',
      required: true,
      schema: { $ref: "#/definitions/AgendaDeTurnosHorariosUpdateInput" }
    }
    */
    genericMiddleware.existsModelById(AgendaTurnos),
    genericMiddleware.schemaValidator(agendaTurnosSchema.agendaTurnosSchemaUpdateHorarios),
    agendaTurnosMiddleware.validarHorarios,
    //agendaTurnosMiddleware.validarLosHorariosEntreAgendasYPrestadores,
    agendaTurnosController.actualizarHorariosDeAgendaTurnos
);

router.put("/:id/especialidades",
    /* 
    #swagger.tags = ['Agendas de Turnos']
    #swagger.path = '/api/agenda-turnos/{id}/especialidades'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Especialidades de la Agenda de Turnos',
      required: true,
      schema: { $ref: "#/definitions/AgendaDeTurnosEspecialidadesUpdateInput" }
    }
    */
    genericMiddleware.existsModelById(AgendaTurnos),
    genericMiddleware.schemaValidator(agendaTurnosSchema.agendaTurnosSchemaUpdateEspecialidad),
    genericMiddleware.existModelRequest(Especialidad),
    agendaTurnosMiddleware.validarQueLaEspecialidadTengaRelacionConElPrestador,
    agendaTurnosMiddleware.validarQueNoExistaUnaAgendaConElMismoPrestadorMismoLugarYMismaEspecialidad,
    agendaTurnosController.actualizarEspecialidadDeAgendaTurnos
);

router.delete("/:id",
    /* 
    #swagger.tags = ['Agendas de Turnos']
    #swagger.path = '/api/agenda-turnos/{id}'
    */
    genericMiddleware.existsModelById(AgendaTurnos),
    agendaTurnosController.eliminarAgendaTurnos
);

module.exports = router;