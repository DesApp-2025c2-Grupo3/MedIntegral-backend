const app = require('./main')
const { telefonoRutas } = require('./routes')

app.use('/telefonos', telefonoRutas)