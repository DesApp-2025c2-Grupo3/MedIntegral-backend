const EXPRESS = require('express');
const APP = EXPRESS();
const DB = require('./db/models');
const { telefonoRutas } = require('./routes')

const CORS = require('cors');

APP.use(EXPRESS.json());

//APP.use(CORS({origin: 'http://localhost:5173'}));

require('dotenv').config();

const PORT = process.env.PORT || 3002;

APP.use('/telefonos', telefonoRutas)

APP.listen(PORT, async () => {
    console.log(`App corriendo en el puerto ${PORT}`);
    await DB.sequelize.sync(
        //{force: true}
    );
})

