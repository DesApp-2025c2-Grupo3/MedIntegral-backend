const app = require('./main')
const { telefonoRutas, provinciaRutas, especialidadRutas, diaRutas, direccionRutas } = require('./routes')

app.use('/telefonos', telefonoRutas)
app.use('/provincias', provinciaRutas)
app.use('/especialidades', especialidadRutas)
app.use('/dias', diaRutas)
app.use('/direcciones', direccionRutas)
