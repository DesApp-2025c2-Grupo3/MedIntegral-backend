const EXPRESS = require('express');
const APP = EXPRESS();
const DB = require('./db/models');

const CORS = require('cors');

APP.use(EXPRESS.json());

//APP.use(CORS({origin: 'http://localhost:5173'}));

require('dotenv').config();

const PORT = process.env.PORT || 3002;

APP.listen(PORT, async () => {
    console.log(`App corriendo en el puerto ${PORT}`);
    await DB.sequelize.sync(
        //{force: true}
    );
})

