const { Afiliado } = require("../db/models");

const yaExisteNumeroDeDni = async (req, res, next) => {
  const { numeroDocumento } = req.body;
  try {
    const afiliadoExistente = await Afiliado.findOne({
      where: {
        numeroDocumento: numeroDocumento,
      },
    });
    if (afiliadoExistente) {
      return res.status(400).json({
        message: `El numero de documento ya está registrado`,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  yaExisteNumeroDeDni,
};
