const EXPRESS = require('express')
const APP = EXPRESS()
const DB = require('./db/models')


APP.listen(3005, async () => {
    console.log("App en el puerto 3005");
    await DB.sequelize.sync({ force:true })
})

