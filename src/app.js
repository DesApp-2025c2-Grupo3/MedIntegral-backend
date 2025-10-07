const app = require('./main')
const { telefonoRutas, provinciaRutas, direccionRutas } = require('./routes')

app.use('/telefonos', telefonoRutas)
app.use('/provincias', provinciaRutas)
app.use('/direcciones', direccionRutas)
