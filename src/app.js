const app = require('./main')
const { telefonoRutas, provinciaRutas, especialidadRutas, diaRutas, direccionRutas } = require('./routes')
const { genericMiddleware } = require("./middlewares");

app.use(genericMiddleware.logRequest); // se utiliza para ver que peticion se hizo y que se envio, es para debuggear
app.use(genericMiddleware.manejoDeErroresGlobales); // Manejo de errores globales
app.use('/telefonos', telefonoRutas)
app.use('/provincias', provinciaRutas)
app.use('/especialidades', especialidadRutas)
app.use('/dias', diaRutas)
app.use('/direcciones', direccionRutas)
