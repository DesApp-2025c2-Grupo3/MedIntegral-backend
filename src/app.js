const app = require('./main')
const { telefonoRutas, provinciaRutas, diaRutas } = require('./routes')

app.use('/telefonos', telefonoRutas)
app.use('/provincias', provinciaRutas)
app.use('/dias', diaRutas)
