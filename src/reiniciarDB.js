const db = require("./db/models");

(async () => {
    try {
        console.log('Borrando base de datos...');
        await db.sequelize.sync({ force: true });
        console.log('Base de datos borrada con éxito.');
        process.exit(0); // Finaliza el proceso
    } catch (error) {
        console.error('Error al reiniciar la base de datos:', error);
        process.exit(1);
    }
})();