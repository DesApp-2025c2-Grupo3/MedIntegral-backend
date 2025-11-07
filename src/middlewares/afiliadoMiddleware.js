const { errorPersonalizado } = require('./genericMiddleware');
const { Afiliado } = require("../db/models");

const yaExisteElTipoYNumeroDeDni = async (req, res, next) => {
    const { tipoDocumentoId, numeroDocumento } = req.body;
    const afiliados = await Afiliado.findAll();

    const existeDni = afiliados.some(a => a.numeroDocumento === numeroDocumento && a.tipoDocumentoId === tipoDocumentoId);

    if (existeDni) {
        return errorPersonalizado(`El tipo y numero de documento ${numeroDocumento} ya está registrado`, 400, next);
    }
    next();
};

module.exports = {
    yaExisteElTipoYNumeroDeDni
};