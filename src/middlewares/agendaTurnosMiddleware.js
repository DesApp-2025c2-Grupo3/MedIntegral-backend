const { errorPersonalizado } = require('./genericMiddleware');
const { Prestador, LugarAtencion, Especialidad } = require("../db/models");

const validarExistenciaDeModelos = async (req, res, next) => {
    
    const entidadesRelacionadas = [Prestador, Especialidad, LugarAtencion];

    entidadesRelacionadas.forEach(async (entidad) => {
        const idModelo = req.body[entidad.name.toLowerCase() + "Id"];
        if (idModelo) {
            const modeloExistente = await entidad.findByPk(idModelo);
            if (!modeloExistente) {
                return errorPersonalizado(`El ${entidad.name} con id ${idModelo} no existe`, 400, next);
            }
        }
    });
    next();
};

module.exports = {
    validarExistenciaDeModelos
};