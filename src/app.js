const { provinciaRutas, especialidadRutas, diaRutas, prestadorRutas, agendaTurnosRutas } = require('./routes');
const { genericMiddleware } = require("./middlewares");

const configureApp = (APP) => {
	APP.use(genericMiddleware.logRequest); // se utiliza para ver que peticion se hizo y que se envio, es para debuggear
	APP.use(genericMiddleware.manejoDeErroresGlobales); // Manejo de errores globales
	APP.use('/api/provincias', provinciaRutas);
	APP.use('/api/especialidades', especialidadRutas);
	APP.use('/api/dias', diaRutas);
	APP.use('/api/prestadores', prestadorRutas);
	APP.use('/api/agenda-turnos', agendaTurnosRutas);
	return APP;
};

module.exports = { configureApp };