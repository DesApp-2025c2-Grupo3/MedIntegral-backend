const { Afiliado } = require("../db/models");
const dayjs = require("dayjs");

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

const validateVigencia = (req, res, next) => {
  const { vigenciaInicio, vigenciaFin, tieneFechaBaja } = req.body;

  if (!vigenciaInicio) {
    return res.status(400).json({
      field: "vigenciaInicio",
      message: "La fecha de inicio de vigencia es obligatoria.",
    });
  }

  if (!tieneFechaBaja) {
    return next();
  }

  if (!vigenciaFin) {
    return res.status(400).json({
      field: "vigenciaFin",
      message:
        "La fecha de fin de vigencia es obligatoria cuando se marca fecha de baja.",
    });
  }

  const inicio = dayjs(vigenciaInicio);
  const fin = dayjs(vigenciaFin);

  if (fin.isBefore(inicio)) {
    return res.status(400).json({
      field: "vigenciaFin",
      message:
        "La fecha de fin de vigencia no puede ser anterior a la de inicio.",
    });
  }

  if (fin.isSame(inicio)) {
    return res.status(400).json({
      field: "vigenciaFin",
      message: "La fecha de fin de vigencia no puede ser igual a la de inicio.",
    });
  }

  if (fin.diff(inicio, "day") < 30) {
    return res.status(400).json({
      field: "vigenciaFin",
      message:
        "La fecha de fin debe ser al menos 30 días después de la fecha de inicio.",
    });
  }

  next();
};

const validateDocumentoUnicoEnActualizacion = async (req, res, next) => {
  const { id } = req.params;
  const { numeroDocumento } = req.body;

  if (!numeroDocumento) {
    return next();
  }

  try {
    const afiliadoExistente = await Afiliado.findOne({
      where: {
        numeroDocumento: numeroDocumento,
        id: { [Op.ne]: id }
      },
    });

    if (afiliadoExistente) {
      return res.status(400).json({
        message: `Ya existe otro afiliado con este número de documento`,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  yaExisteNumeroDeDni,
  validateVigencia,
  validateDocumentoUnicoEnActualizacion
};
