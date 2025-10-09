const app = require('./main')
const { telefonoRutas, provinciaRutas, especialidadRutas } = require('./routes')

app.use('/telefonos', telefonoRutas)
app.use('/provincias', provinciaRutas)
app.use('/especialidades', especialidadRutas)
