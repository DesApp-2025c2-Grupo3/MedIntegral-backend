const {
  provinciaRutas,
  especialidadRutas,
  prestadorRutas,
  agendaTurnosRutas,
  afiliadoRutas,
  tipoDocumentoRutas,
  situacionTerapeuticaRutas,
  planMedicoRutas,
  parentescoRutas
} = require("./routes");
const { genericMiddleware } = require("./middlewares");

const configureApp = (APP) => {
  APP.use(genericMiddleware.logRequest); // se utiliza para ver que peticion se hizo y que se envio, es para debuggear
  APP.use(genericMiddleware.manejoDeErroresGlobales); // Manejo de errores globales
  APP.use("/api/provincias", provinciaRutas);
  APP.use("/api/especialidades", especialidadRutas);
  APP.use("/api/prestadores", prestadorRutas);
  APP.use("/api/agenda-turnos", agendaTurnosRutas);
  APP.use("/api/afiliados", afiliadoRutas);
  APP.use("/api/tipoDocumentos", tipoDocumentoRutas);
  APP.use("/api/situacionesTerapeuticas", situacionTerapeuticaRutas);
  APP.use("/api/planesMedicos", planMedicoRutas);
  APP.use('/api/parentescos', parentescoRutas);

  return APP;
};

module.exports = { configureApp };
