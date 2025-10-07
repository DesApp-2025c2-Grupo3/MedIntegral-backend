const app = require('./main')
const { telefonoRutas, provinciaRutas } = require('./routes')

app.use('/telefonos', telefonoRutas)
app.use('/provincias', provinciaRutas)
