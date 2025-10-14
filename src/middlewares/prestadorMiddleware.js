const { errorPersonalizado } = require('./genericMiddleware');
const { Prestador } = require("../db/models");

const validarExistenciaCentroMedico = async (req, res, next) => {
    const { integraCentroMedico, centroMedicoQueIntegra, esCentroMedico } = req.body;

    if (integraCentroMedico) {
        const centroMedico = await Prestador.findByPk(centroMedicoQueIntegra)
        if (!centroMedico) {
            return errorPersonalizado(`El centro médico con id ${centroMedicoQueIntegra} no existe`, 400, next);
        }
        if (!centroMedico.esCentroMedico) {
            return errorPersonalizado(`El prestador con id ${centroMedicoQueIntegra} no es un centro médico`, 400, next);
        }
    }
    next();
};

module.exports = {
    validarExistenciaCentroMedico
};