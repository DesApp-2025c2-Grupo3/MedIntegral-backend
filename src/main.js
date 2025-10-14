const EXPRESS = require('express');
const APP = EXPRESS();
const CORS = require('cors');
const DB = require('./db/models');
const { prestadorRutas, agendaTurnosRutas } = require('./routes');
const { genericMiddleware } = require("./middlewares");
require('dotenv').config();

const PORT = process.env.PORT || 3002;

APP.use(CORS({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

APP.use(EXPRESS.json());

APP.use(genericMiddleware.logRequest);
APP.use(genericMiddleware.manejoDeErroresGlobales);
APP.use('/prestadores', prestadorRutas);
APP.use('/api/agenda-turnos', agendaTurnosRutas);
APP.listen(PORT, async () => {
  console.log(`App corriendo en el puerto ${PORT}`);
  await DB.sequelize.sync(
    //{force: true}
  );
});
