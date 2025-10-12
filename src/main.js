const EXPRESS = require('express');
const APP = EXPRESS();
const DB = require('./db/models');
const { prestadorRutas, provinciaRutas, diaRutas, agendaTurnosRutas } = require('./routes')
const { genericMiddleware } = require("./middlewares");

//const CORS = require('cors');

APP.use(EXPRESS.json());

//APP.use(CORS({origin: 'http://localhost:5173'}));

require('dotenv').config();

const PORT = process.env.PORT || 3002;

APP.use(genericMiddleware.logRequest); // se utiliza para ver que peticion se hizo y que se envio, es para debuggear
APP.use(genericMiddleware.manejoDeErroresGlobales); // Manejo de errores globales
APP.use('/prestadores', prestadorRutas)
APP.use('/agendasTurnos', agendaTurnosRutas)
//para debuggear
APP.use('/provincias', provinciaRutas)
APP.use('/dias', diaRutas)

APP.listen(PORT, async () => {
    console.log(`App corriendo en el puerto ${PORT}`);
    await DB.sequelize.sync(
        //{force: true}
    );
})

