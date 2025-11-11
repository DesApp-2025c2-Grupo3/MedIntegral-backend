const EXPRESS = require('express');
const APP = EXPRESS();
const CORS = require('cors');
const DB = require('./db/models');
const { configureApp } = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3002;

APP.use(CORS({
  origin: '*',  //'http://localhost:5173', 'https://medintegral.vmdigitai.com/api'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

APP.use(EXPRESS.json());
// Configuro rutas y middlewares desde app.js
configureApp(APP);

APP.listen(PORT, async () => {
  console.log(`App corriendo en el puerto ${PORT}`);
  await DB.sequelize.sync(
    //{force: true}
  );
});

module.exports = { APP };